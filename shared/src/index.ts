// ============================================================
// HireMind AI — Shared Type Definitions
// Talent Intelligence Ecosystem
// ============================================================

// ---- Enums ----

export enum UserRole {
  RECRUITER = "RECRUITER",
  CANDIDATE = "CANDIDATE",
  ADMIN = "ADMIN",
}

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  SCREENING = "SCREENING",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
  SECOND_CHANCE = "SECOND_CHANCE",
}

export enum JobStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  CLOSED = "CLOSED",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  FAILED = "FAILED",
  CHALLENGED = "CHALLENGED",
}

export enum NotificationType {
  MATCH = "MATCH",
  STATUS_UPDATE = "STATUS_UPDATE",
  CHALLENGE = "CHALLENGE",
  LEARNING = "LEARNING",
  SYSTEM = "SYSTEM",
  FUTURE_ROLE = "FUTURE_ROLE",
}

// ---- Core Entities ----

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  userId: string;
  headline?: string;
  summary?: string;
  resumeUrl?: string;
  resumeText?: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string[];
  portfolioUrls: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  dna?: CandidateDNA;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recruiter {
  id: string;
  userId: string;
  company: string;
  title?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  niceToHave: string[];
  skills: string[];
  location: string;
  locationType: "REMOTE" | "HYBRID" | "ONSITE";
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status: JobStatus;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  matchScore: number;
  intentScore: number;
  potentialScore: number;
  authenticityScore: number;
  hiddenGemScore: number;
  overallRank: number;
  aiExplanation: string;
  transferableSkills: TransferableSkill[];
  createdAt: Date;
  updatedAt: Date;
}

// ---- AI Intelligence Models ----

export interface CandidateDNA {
  id: string;
  candidateId: string;
  technicalDepth: number;
  problemSolving: number;
  leadership: number;
  communication: number;
  creativity: number;
  adaptability: number;
  domainExpertise: number;
  growthTrajectory: number;
  overallScore: number;
  strengths: string[];
  growthAreas: string[];
  embedding?: number[];
  generatedAt: Date;
}

export interface IntentAnalysis {
  id: string;
  candidateId: string;
  jobId: string;
  intentScore: number;
  signals: IntentSignal[];
  genuineInterest: number;
  culturalAlignment: number;
  longTermFit: number;
  analysis: string;
  createdAt: Date;
}

export interface IntentSignal {
  type: string;
  description: string;
  weight: number;
  confidence: number;
}

export interface TruePotential {
  id: string;
  candidateId: string;
  currentLevel: string;
  predictedLevel: string;
  timeframeMonths: number;
  potentialScore: number;
  growthFactors: GrowthFactor[];
  careerTrajectory: CareerPrediction[];
  analysis: string;
  createdAt: Date;
}

export interface GrowthFactor {
  factor: string;
  score: number;
  evidence: string;
}

export interface CareerPrediction {
  role: string;
  company?: string;
  probability: number;
  timeframeMonths: number;
  requiredSkills: string[];
}

export interface HiddenGemAnalysis {
  id: string;
  candidateId: string;
  jobId: string;
  gemScore: number;
  transferableSkills: TransferableSkill[];
  unconventionalStrengths: string[];
  adjacentExperience: string[];
  analysis: string;
  createdAt: Date;
}

export interface TransferableSkill {
  fromSkill: string;
  toSkill: string;
  transferability: number;
  evidence: string;
}

export interface AuthenticityChallenge {
  id: string;
  candidateId: string;
  questions: ChallengeQuestion[];
  overallScore: number;
  knowledgeConfidence: number;
  status: VerificationStatus;
  completedAt?: Date;
  createdAt: Date;
}

export interface ChallengeQuestion {
  id: string;
  skill: string;
  question: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  expectedAnswer: string;
  candidateAnswer?: string;
  score?: number;
  feedback?: string;
}

export interface TalentTwin {
  id: string;
  candidateId: string;
  twinCandidateId: string;
  similarityScore: number;
  sharedStrengths: string[];
  differentiators: string[];
  createdAt: Date;
}

export interface FutureMatch {
  id: string;
  candidateId: string;
  predictedRole: string;
  predictedCompany?: string;
  matchProbability: number;
  requiredGrowth: string[];
  timeframeMonths: number;
  createdAt: Date;
}

export interface LearningRoadmap {
  id: string;
  candidateId: string;
  title: string;
  milestones: RoadmapMilestone[];
  targetRole: string;
  estimatedWeeks: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  resources: string[];
  order: number;
  completed: boolean;
  completedAt?: Date;
}

// ---- Supporting Types ----

export interface ExperienceEntry {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
  gpa?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ---- API Types ----

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SearchQuery {
  query: string;
  filters?: Record<string, unknown>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DashboardStats {
  totalCandidates: number;
  totalJobs: number;
  activeApplications: number;
  hiddenGemsFound: number;
  averageMatchScore: number;
  topSkills: { skill: string; count: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// ---- AI Chat Types ----

export interface AIChatRequest {
  message: string;
  context: "recruiter" | "candidate";
  conversationHistory?: ChatMessage[];
  userId: string;
}

export interface AIChatResponse {
  message: string;
  suggestions?: string[];
  data?: Record<string, unknown>;
}

// ---- Resume Parsing Types ----

export interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string[];
  links: string[];
  rawText: string;
}

export interface ResumeUploadResponse {
  candidateId: string;
  parsedData: ParsedResume;
  dna: CandidateDNA;
  matchResults?: {
    jobId: string;
    score: number;
    explanation: string;
  }[];
}
