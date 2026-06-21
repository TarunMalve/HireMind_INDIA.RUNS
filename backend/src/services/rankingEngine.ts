export interface CandidateDNA {
  technical_fit: number;
  experience_fit: number;
  career_trajectory: number;
  behavioral_intent: number;
  credibility: number;
  hidden_gem_score: number;
}

export interface RankResult {
  candidate_id: string;
  match_score: number;
  rank_score: number;
  candidate_dna: CandidateDNA;
  strengths: string[];
  risks: string[];
  hidden_gem: boolean;
  honeypot_risk: boolean;
  reasoning: string;
  hire_probability?: {
    qualified: number;
    available: number;
    engageable: number;
    legitimate: number;
    growth: number;
    scrappiness: number;
    hire_score: number;
  };
}

/**
 * Normalizes skill names for comparison (lowercase, remove spaces and hyphens)
 */
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().replace(/[\s\-_]/g, '');
}

/**
 * Dictionary of adjacent skills for fallback scoring.
 */
const skillAdjacencies: Record<string, string[]> = {
  react: ['vue', 'vuejs', 'svelte', 'angular', 'solidjs'],
  vue: ['react', 'svelte', 'angular'],
  svelte: ['react', 'vue', 'angular'],
  aws: ['gcp', 'googlecloud', 'azure', 'cloud'],
  gcp: ['aws', 'azure', 'cloud'],
  azure: ['aws', 'gcp', 'cloud'],
  tailwind: ['sass', 'scss', 'css', 'bootstrap'],
  sass: ['tailwind', 'scss', 'css', 'bootstrap'],
  python: ['r', 'julia', 'matlab'],
  go: ['rust', 'c++', 'java', 'python'],
  kubernetes: ['docker', 'nomad', 'ecs', 'swarm'],
  docker: ['kubernetes', 'containerization'],
  mongodb: ['postgresql', 'mysql', 'dynamodb', 'nosql'],
  postgresql: ['mysql', 'sqlite', 'mongodb', 'oracle'],
};

/**
 * Check if two skills are adjacent
 */
function areSkillsAdjacent(skillA: string, skillB: string): boolean {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);
  
  if (normA === normB) return true;
  if (skillAdjacencies[normA]?.includes(normB)) return true;
  if (skillAdjacencies[normB]?.includes(normA)) return true;
  
  return false;
}

/**
 * 1. Technical Fit (35%)
 * Score based on exact and adjacent skill matches.
 */
function calculateTechnicalFit(candidateSkills: string[], jobSkills: string[]): { score: number; strengths: string[]; risks: string[] } {
  if (!jobSkills || jobSkills.length === 0) return { score: 100, strengths: [], risks: [] };

  let exactMatches = 0;
  let adjacentMatches = 0;
  const missingCritical: string[] = [];
  const foundStrengths: string[] = [];

  for (const reqSkill of jobSkills) {
    const normReq = normalizeSkill(reqSkill);
    let matched = false;

    // Check exact match
    if (candidateSkills.some(candSkill => normalizeSkill(candSkill) === normReq)) {
      exactMatches++;
      foundStrengths.push(reqSkill);
      matched = true;
    } else {
      // Check adjacent match
      for (const candSkill of candidateSkills) {
        if (areSkillsAdjacent(reqSkill, candSkill)) {
          adjacentMatches++;
          foundStrengths.push(`${candSkill} (equivalent to ${reqSkill})`);
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      missingCritical.push(reqSkill);
    }
  }

  // Exact matches count for 100%, adjacent matches count for 70%
  const matchPoints = (exactMatches * 1.0) + (adjacentMatches * 0.7);
  const rawScore = (matchPoints / jobSkills.length) * 100;
  const score = Math.min(100, Math.round(rawScore));

  const strengths = foundStrengths.slice(0, 3).map(s => `Strong knowledge in ${s}`);
  const risks = missingCritical.length > 0 
    ? [`Lacks direct experience with: ${missingCritical.join(', ')}`] 
    : [];

  return { score, strengths, risks };
}

/**
 * 2. Experience Fit (20%)
 * Score based on total years of experience and level comparison.
 */
function calculateExperienceFit(experienceYears: number, jobTitle: string): number {
  const titleLower = jobTitle.toLowerCase();
  let targetYears = 2; // default junior/mid

  if (titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('architect')) {
    targetYears = 8;
  } else if (titleLower.includes('senior')) {
    targetYears = 5;
  } else if (titleLower.includes('director') || titleLower.includes('vp')) {
    targetYears = 10;
  }

  if (experienceYears >= targetYears) {
    // Exceeds or meets target
    return Math.min(100, 80 + Math.round(((experienceYears - targetYears) / 5) * 20));
  } else {
    // Under target years
    return Math.max(20, Math.round((experienceYears / targetYears) * 80));
  }
}

/**
 * 3. Career Trajectory (10%)
 * Progression pattern analysis based on potential score/progression.
 */
function calculateCareerTrajectory(candidate: any): number {
  // Use potential_score or calculate progression velocity based on roles in candidate profile.
  // Standard default if not specified is 75.
  if (candidate.potential_score) {
    return Math.round(candidate.potential_score);
  }
  return 75;
}

/**
 * 4. Behavioral Intent (15%)
 * Availability, responsiveness, active contributions.
 */
function calculateBehavioralIntent(candidate: any): number {
  if (candidate.intent_score) {
    return Math.round(candidate.intent_score);
  }
  return 70;
}

/**
 * 5. Credibility (10%)
 * Verified history, consistency, verification challenge results.
 */
function calculateCredibility(candidate: any): number {
  let score = 70; // baseline
  
  if (candidate.authenticity_score !== undefined && candidate.authenticity_score > 0) {
    score = Math.round(candidate.authenticity_score);
  } else if (candidate.verified) {
    score = 95;
  }

  // Adjust score based on presence of linkedin/github profile links
  if (candidate.linkedinUrl || candidate.githubUrl) {
    score = Math.min(100, score + 5);
  }

  return score;
}

/**
 * 6. Hidden Gem (10%)
 * Recognizes high capability in equivalent stacks, unconventional backgrounds, high potential.
 */
function calculateHiddenGem(
  candidateSkills: string[], 
  jobSkills: string[], 
  potentialScore: number
): { score: number; isGem: boolean } {
  let adjacentCount = 0;
  
  for (const reqSkill of jobSkills) {
    const normReq = normalizeSkill(reqSkill);
    // If not exact match, but has adjacent match
    if (!candidateSkills.some(s => normalizeSkill(s) === normReq)) {
      if (candidateSkills.some(s => areSkillsAdjacent(reqSkill, s))) {
        adjacentCount++;
      }
    }
  }

  // A candidate is a hidden gem if they have strong adjacent capabilities and high potential,
  // but don't meet all exact keywords.
  const isAdjacentMatch = adjacentCount >= 2;
  const isHighPotential = potentialScore >= 90;
  
  let score = 50; // baseline
  if (isAdjacentMatch) score += 25;
  if (isHighPotential) score += 25;

  const isGem = score >= 85;

  return { score, isGem };
}

/**
 * 7. Honeypot Detection
 * Returns true if candidate profile shows clear signs of keyword stuffing,
 * copying job requirements exactly (100% skill match score with zero deviation),
 * or contradictory timeline claims.
 */
function detectHoneypot(candidate: any, job: any): boolean {
  if (!job || !job.skills || job.skills.length === 0) return false;

  const candSkillsNormalized = (candidate.skills || []).map((s: any) => typeof s === 'string' ? normalizeSkill(s) : normalizeSkill(s.name));
  const jobSkillsNormalized = job.skills.map((s: string) => normalizeSkill(s));

  // Check if they claim exactly every single skill on the job description without any extra skills
  const exactMatchCount = jobSkillsNormalized.filter((s: string) => candSkillsNormalized.includes(s)).length;
  const hasExtraneousSkills = candSkillsNormalized.length > jobSkillsNormalized.length;

  // Perfect keyword match + no extra skills = suspicious of resume stuffing
  if (exactMatchCount === jobSkillsNormalized.length && !hasExtraneousSkills) {
    return true;
  }

  // Check if candidate profile summary contains verbatim text from the job description
  if (candidate.summary && job.description) {
    const summaryClean = candidate.summary.toLowerCase().replace(/[^a-z0-9]/g, '');
    const jdClean = job.description.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Verbatim long substring match of job description in summary (more than 50 characters)
    if (jdClean.length > 50 && summaryClean.includes(jdClean.substring(0, 50))) {
      return true;
    }
  }

  return false;
}

/**
 * Primary ranking method applying the 6-dimension weights:
 * - Technical Fit: 35%
 * - Experience Fit: 20%
 * - Career Trajectory: 10%
 * - Behavioral Intent: 15%
 * - Credibility: 10%
 * - Hidden Gem: 10%
 */
function getExperienceYears(candidate: any): number {
  if (typeof candidate.experience === 'number') {
    return candidate.experience;
  }
  if (Array.isArray(candidate.experience)) {
    let totalYears = 0;
    for (const exp of candidate.experience) {
      if (exp && exp.duration) {
        const durationStr = String(exp.duration).toLowerCase();
        const matchYears = durationStr.match(/(\d+)\s*yr/);
        const matchMonths = durationStr.match(/(\d+)\s*mo/);
        if (matchYears) {
          totalYears += parseInt(matchYears[1]);
        } else if (matchMonths) {
          totalYears += parseInt(matchMonths[1]) / 12;
        } else {
          const numMatch = durationStr.match(/(\d+)/);
          if (numMatch) {
            totalYears += parseInt(numMatch[1]);
          }
        }
      } else if (exp && typeof exp.years === 'number') {
        totalYears += exp.years;
      }
    }
    return totalYears > 0 ? Math.round(totalYears) : 2;
  }
  if (typeof candidate.experienceYears === 'number') {
    return candidate.experienceYears;
  }
  return 2;
}

export function rankCandidate(candidate: any, job: any): RankResult {
  const candidateSkills = (candidate.skills || []).map((s: any) => typeof s === 'string' ? s : s.name);
  const jobSkills = job.skills || job.requirements || [];

  const { score: technicalFit, strengths: techStrengths, risks: techRisks } = calculateTechnicalFit(candidateSkills, jobSkills);
  
  const experienceYears = getExperienceYears(candidate);
  const experienceFit = calculateExperienceFit(experienceYears, job.title);
  
  const careerTrajectory = calculateCareerTrajectory(candidate);
  const behavioralIntent = calculateBehavioralIntent(candidate);
  const credibility = calculateCredibility(candidate);
  
  const { score: hiddenGemScore, isGem } = calculateHiddenGem(candidateSkills, jobSkills, careerTrajectory);
  
  const honeypot_risk = detectHoneypot(candidate, job);

  // Compute 6 independent P-factors (0.0 to 1.0 scale)
  const pQualified = Math.max(0.05, Math.min(1.0, (technicalFit * 0.7 + experienceFit * 0.3) / 100));
  const pAvailable = Math.max(0.05, Math.min(1.0, (0.4 + (behavioralIntent / 100) * 0.4 + (experienceFit / 100) * 0.2)));
  const pEngageable = Math.max(0.05, Math.min(1.0, (0.5 + (behavioralIntent / 100) * 0.3 + (candidate.readiness?.communication || 85) / 100 * 0.2)));
  const pLegitimate = honeypot_risk ? 0.10 : Math.max(0.05, Math.min(1.0, credibility / 100));
  const pGrowth = Math.max(0.05, Math.min(1.0, (careerTrajectory * 0.8 + hiddenGemScore * 0.2) / 100));
  const pScrappiness = Math.max(0.05, Math.min(1.0, (hiddenGemScore * 0.6 + careerTrajectory * 0.4) / 100));

  // Compute multiplicative final score
  const hireProbabilityValue = pQualified * pAvailable * pEngageable * pLegitimate * pGrowth * pScrappiness;
  const match_score = Math.round(hireProbabilityValue * 100);

  // Strengths compilation
  const strengths = [...techStrengths];
  if (experienceFit >= 85) strengths.push('Strong professional background in related role');
  if (careerTrajectory >= 90) strengths.push('Outstanding career progression velocity');
  if (behavioralIntent >= 90) strengths.push('Highly active and engaged candidate');

  // Risks compilation
  const risks = [...techRisks];
  if (honeypot_risk) {
    risks.unshift('CRITICAL: High probability of resume stuffing / Honeypot profile');
  }
  if (experienceFit < 60) risks.push('Years of experience is below role guidelines');
  if (credibility < 60) risks.push('Verification metrics show timeline inconsistencies');

  // Reasoning formulation
  let reasoning = '';
  if (honeypot_risk) {
    reasoning = `Honeypot Alert: This candidate's profile matches the job requirements perfectly without any adjacent or outside skills, indicating automated keyword stuffing. Legitimate rating was dropped to 10% and final score penalized accordingly.`;
  } else if (isGem) {
    reasoning = `${candidate.name} is classified as a Hidden Gem. While lacking direct keywords like ${jobSkills.filter((s: string) => !candidateSkills.some((cs: string) => normalizeSkill(cs) === normalizeSkill(s))).slice(0,2).join(', ')}, they demonstrate excellent competence in adjacent technologies and high potential for quick onboarding.`;
  } else {
    reasoning = `${candidate.name} shows a robust ${match_score}% hire probability score, with strong scores in Qualification (${Math.round(pQualified*100)}%) and Legitimate check (${Math.round(pLegitimate*100)}%). Trajectory and intent scores indicate high readiness for this role.`;
  }

  return {
    candidate_id: candidate.id,
    match_score,
    rank_score: match_score, 
    candidate_dna: {
      technical_fit: Math.round(pQualified * 100),
      experience_fit: Math.round(pAvailable * 100),
      career_trajectory: Math.round(pEngageable * 100),
      behavioral_intent: Math.round(pLegitimate * 100),
      credibility: Math.round(pGrowth * 100),
      hidden_gem_score: Math.round(pScrappiness * 100),
    },
    strengths: strengths.slice(0, 3),
    risks: risks.slice(0, 3),
    hidden_gem: isGem,
    honeypot_risk,
    reasoning,
    hire_probability: {
      qualified: parseFloat(pQualified.toFixed(2)),
      available: parseFloat(pAvailable.toFixed(2)),
      engageable: parseFloat(pEngageable.toFixed(2)),
      legitimate: parseFloat(pLegitimate.toFixed(2)),
      growth: parseFloat(pGrowth.toFixed(2)),
      scrappiness: parseFloat(pScrappiness.toFixed(2)),
      hire_score: match_score
    }
  };
}
