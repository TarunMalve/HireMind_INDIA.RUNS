// High-fidelity pre-seeded data for the HireMind AI platform

const initialJobs = [
  {
    job_id: "job-1",
    title: "Senior Frontend Architect",
    department: "Engineering",
    active_candidates: 8,
    match_health: 94,
    required_skills: ["React", "TypeScript", "TailwindCSS", "AWS Cloud", "Next.js"]
  },
  {
    job_id: "job-2",
    title: "Distributed Systems Engineer",
    department: "Platform Core",
    active_candidates: 12,
    match_health: 87,
    required_skills: ["Go", "Kubernetes", "Microservices", "gRPC", "AWS"]
  },
  {
    job_id: "job-3",
    title: "AI Research Scientist",
    department: "HireMind AI Lab",
    active_candidates: 6,
    match_health: 91,
    required_skills: ["Python", "TensorFlow", "NLP", "PyTorch", "Transformers"]
  },
  {
    job_id: "job-4",
    title: "Lead DevOps Specialist",
    department: "Operations",
    active_candidates: 5,
    match_health: 82,
    required_skills: ["Terraform", "Docker", "AWS", "CI/CD", "Python"]
  }
];

const candidates = [
  {
    id: "cand-1",
    name: "Helena Rostova",
    title: "Senior UI Developer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    experience: 6,
    overall_score: 93,
    categories: ["hidden_gem", "fast_learner"],
    skill_match_score: 91,
    experience_score: 88,
    potential_score: 96,
    intent_score: 92,
    alignment_score: 90,
    skills: [
      { name: "Vue.js", level: 95, matchType: "adjacent", equivalentTo: "React" },
      { name: "TypeScript", level: 90, matchType: "exact" },
      { name: "Sass/CSS", level: 92, matchType: "adjacent", equivalentTo: "TailwindCSS" },
      { name: "GCP (Cloud)", level: 85, matchType: "adjacent", equivalentTo: "AWS Cloud" },
      { name: "Next.js", level: 88, matchType: "exact" }
    ],
    why_selected: "Helena is a textbook Hidden Gem. While the role lists React & AWS, she is an expert in Vue.js and GCP, demonstrating identical architectural knowledge in single-page apps and serverless environments. Her high potential score (96) is backed by her rapid transition from designer to lead UI architect in just 4 years.",
    strengths: [
      "Deep understanding of frontend state-management paradigms",
      "Exceptional visual aesthetics and component design principles",
      "Demonstrated ability to master new frameworks within weeks"
    ],
    risks: [
      "No direct production experience with AWS (primarily GCP native)",
      "Minimal experience working in massive monorepos"
    ],
    predicted_role_2yr: "Principal UI Architect",
    prediction_confidence: "91%",
    prediction_rationale: "Given her technical growth velocity and strong communication scores, Helena is on track to lead enterprise frontend architectures within 24 months.",
    readiness: { technical: 92, communication: 95, domain: 88, culture: 93 },
    target_job_id: "job-1"
  },
  {
    id: "cand-2",
    name: "Marcus Vance",
    title: "Backend Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    experience: 4,
    overall_score: 89,
    categories: ["hidden_gem", "high_intent"],
    skill_match_score: 85,
    experience_score: 80,
    potential_score: 92,
    intent_score: 95,
    alignment_score: 91,
    skills: [
      { name: "Docker", level: 90, matchType: "adjacent", equivalentTo: "Kubernetes" },
      { name: "Distributed Systems", level: 88, matchType: "exact" },
      { name: "Python", level: 92, matchType: "adjacent", equivalentTo: "Go" },
      { name: "gRPC", level: 82, matchType: "exact" },
      { name: "AWS Cloud", level: 85, matchType: "exact" }
    ],
    why_selected: "Marcus has built complex data pipelines and microservices using Python and Docker, proving he can handle distributed architectures. Although the job requires Go & Kubernetes, his underlying network, messaging (gRPC), and distributed system skills are directly adjacent. His high intent score comes from active open-source contributions in container runtimes.",
    strengths: [
      "Strong grasp of concurrency, networking sockets, and message queues",
      "Highly proactive self-learner; actively contributes to CNCF projects",
      "Excellent systems-level debugging capabilities"
    ],
    risks: [
      "Will require a short ramp-up phase to write production-grade Go code",
      "Kubernetes experience is mostly local/dev, not production scale"
    ],
    predicted_role_2yr: "Senior Core Infrastructure Lead",
    prediction_confidence: "86%",
    prediction_rationale: "His intense interest in container internals and infrastructure makes him a natural fit for infrastructure engineering and platform lead roles.",
    readiness: { technical: 86, communication: 90, domain: 89, culture: 92 },
    target_job_id: "job-2"
  },
  {
    id: "cand-3",
    name: "Dr. Kenji Tanaka",
    title: "Machine Learning Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    experience: 7,
    overall_score: 95,
    categories: ["high_intent", "future_leader"],
    skill_match_score: 97,
    experience_score: 94,
    potential_score: 93,
    intent_score: 98,
    alignment_score: 92,
    skills: [
      { name: "Python", level: 98, matchType: "exact" },
      { name: "PyTorch", level: 95, matchType: "exact" },
      { name: "Transformers", level: 92, matchType: "exact" },
      { name: "TensorFlow", level: 85, matchType: "exact" },
      { name: "NLP", level: 94, matchType: "exact" }
    ],
    why_selected: "Kenji is an exceptional applicant who perfectly matches our AI Research role. He has published 3 papers on Transformer efficiency and maintains a widely used NLP toolkit. His intent score is nearly perfect, showcasing long-term domain investment and a deep alignment with HireMind's research objectives.",
    strengths: [
      "PhD-level researcher with practical software engineering skills",
      "Pioneer in custom attention-mechanism optimizations",
      "Excellent technical writing and communication"
    ],
    risks: [
      "Prefers research environments; might find pure product engineering cycles constraining",
      "Expects high degree of scientific autonomy"
    ],
    predicted_role_2yr: "Director of AI Research",
    prediction_confidence: "89%",
    prediction_rationale: "Kenji demonstrates natural academic leadership and team mentorship, positioning him well to run a modern AI laboratory.",
    readiness: { technical: 98, communication: 92, domain: 96, culture: 89 },
    target_job_id: "job-3"
  },
  {
    id: "cand-4",
    name: "Aisha Patel",
    title: "React Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    experience: 3,
    overall_score: 87,
    categories: ["fast_learner", "high_intent"],
    skill_match_score: 88,
    experience_score: 75,
    potential_score: 94,
    intent_score: 96,
    alignment_score: 88,
    skills: [
      { name: "React", level: 90, matchType: "exact" },
      { name: "TypeScript", level: 85, matchType: "exact" },
      { name: "TailwindCSS", level: 95, matchType: "exact" },
      { name: "Next.js", level: 80, matchType: "exact" },
      { name: "AWS Cloud", level: 60, matchType: "gap", equivalentTo: "N/A" }
    ],
    why_selected: "Aisha is a highly motivated mid-level developer. She possesses strong React, Next.js, and TypeScript skills. While she has a minor gap in cloud infrastructure (AWS), her intense open-source commitment and rapid promotion history (True Potential: 94) make her an outstanding growth hire who will easily transition into an architectural role.",
    strengths: [
      "Clean code advocate; strong semantic HTML and accessibility practices",
      "High participation in regional WebDev meetups and hackathons",
      "Thrives in collaborative, fast-paced agile settings"
    ],
    risks: [
      "Requires mentorship on serverless architecture and cloud deployments",
      "Has not managed project builds from scratch previously"
    ],
    predicted_role_2yr: "Senior Full Stack Engineer",
    prediction_confidence: "87%",
    prediction_rationale: "Aisha's rapid technology adoption curves suggest that adding cloud backend capabilities to her frontend mastery will make her a strong full-stack dev inside 2 years.",
    readiness: { technical: 83, communication: 92, domain: 85, culture: 91 },
    target_job_id: "job-1"
  },
  {
    id: "cand-5",
    name: "Liam O'Connor",
    title: "Infrastructure Lead",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    experience: 8,
    overall_score: 91,
    categories: ["future_leader"],
    skill_match_score: 93,
    experience_score: 92,
    potential_score: 88,
    intent_score: 87,
    alignment_score: 95,
    skills: [
      { name: "Terraform", level: 95, matchType: "exact" },
      { name: "Docker", level: 92, matchType: "exact" },
      { name: "AWS", level: 94, matchType: "exact" },
      { name: "CI/CD", level: 90, matchType: "exact" },
      { name: "Python", level: 82, matchType: "exact" }
    ],
    why_selected: "Liam is an experienced Infrastructure Lead who perfectly satisfies our DevOps requirements. He has successfully designed multi-region cloud setups. His leadership score stands out, indicating he can manage small groups and lead key transition strategies.",
    strengths: [
      "Extensive experience with high-availability disaster recovery models",
      "Natural mentor who aligns operational goals with product cycles",
      "Expertise in cost-optimization pipelines"
    ],
    risks: [
      "Relatively conservative regarding experimental tools; prefers proven architectures",
      "Coding limits: relies mostly on scripts rather than software engineering practices"
    ],
    predicted_role_2yr: "VP of Cloud Operations",
    prediction_confidence: "85%",
    prediction_rationale: "His maturity, systems thinking, and leadership capabilities make Liam the ideal candidate to scale infrastructure divisions.",
    readiness: { technical: 92, communication: 90, domain: 91, culture: 94 },
    target_job_id: "job-4"
  },
  {
    id: "cand-6",
    name: "Elena Rostova (Marketplace Profile)",
    title: "Senior Node/Svelte Developer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    experience: 5,
    overall_score: 88,
    categories: ["hidden_gem", "fast_learner"],
    skill_match_score: 84,
    experience_score: 85,
    potential_score: 93,
    intent_score: 90,
    alignment_score: 87,
    skills: [
      { name: "Svelte", level: 92, matchType: "adjacent", equivalentTo: "React" },
      { name: "Node.js", level: 90, matchType: "exact" },
      { name: "TailwindCSS", level: 88, matchType: "exact" },
      { name: "Express", level: 85, matchType: "exact" },
      { name: "Azure Services", level: 75, matchType: "adjacent", equivalentTo: "AWS" }
    ],
    why_selected: "Currently stored in the Talent Marketplace. Elena was a runner-up for our Frontend Opening. She possesses massive Svelte capabilities. If a Svelte/Node role opens up, she will be our absolute top match.",
    strengths: [
      "Highly responsive reactive state models in Svelte",
      "Exceptional API server layout patterns",
      "Very fast coding execution cycles"
    ],
    risks: [
      "Mainly worked in smaller startup squads, needs corporate alignment"
    ],
    predicted_role_2yr: "Full Stack Team Lead",
    prediction_confidence: "88%",
    prediction_rationale: "Has natural technical coaching qualities and handles full-stack architectures fluently.",
    readiness: { technical: 86, communication: 89, domain: 82, culture: 88 },
    target_job_id: "none"
  }
];

const rematches = [
  {
    id: "rematch-1",
    candidateName: "Helena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    previousRole: "Rejected for React Developer (2mo ago)",
    newMatchRole: "Senior Frontend Architect",
    score: 93
  },
  {
    id: "rematch-2",
    candidateName: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    previousRole: "Rejected for Systems Admin (1mo ago)",
    newMatchRole: "Distributed Systems Engineer",
    score: 89
  }
];

const initialNotifications = [
  {
    id: "notif-1",
    type: "rematch",
    title: "AI Ecosystem Match Found",
    body: "Helena Rostova (previously applied for UI Developer) was automatically matched to the new 'Senior Frontend Architect' opening. Match Score: 93% (Hidden Gem).",
    time: "2 hours ago",
    unread: true,
    actionLink: "#candidates"
  },
  {
    id: "notif-2",
    type: "growth",
    title: "Candidate DNA Threshold Met",
    body: "Marcus Vance has updated his GitHub portfolio with 3 new Rust networking repositories. True Potential score increased to 92.",
    time: "5 hours ago",
    unread: true,
    actionLink: "#dna"
  },
  {
    id: "notif-3",
    type: "pipeline",
    title: "Succession Alert",
    body: "Aisha Patel's projected 2-year path to 'Senior Full Stack' has reached 87% confidence based on recent Node.js certification uploads.",
    time: "1 day ago",
    unread: false,
    actionLink: "#pipeline"
  }
];
