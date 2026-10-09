export type EvidenceLevel = "strong" | "moderate" | "weak" | "missing"
export type QuestionCategory = "technical" | "behavioural" | "experience" | "validation"

export interface GuideStrength {
  area: string
  evidence: string
  source: "resume"
}

export interface AreaToValidate {
  requirement: string
  reason: string
  candidateEvidence: string
}

export interface RequirementMatch {
  requirement: string
  candidateEvidence: string
  evidenceLevel: EvidenceLevel
}

export interface GuideQuestion {
  id: string
  category: QuestionCategory
  requirement: string
  candidateEvidence: string
  question: string
  reason: string
}

export interface InterviewGuide {
  candidateName: string
  role: string
  summary: string
  strengths: GuideStrength[]
  areasToValidate: AreaToValidate[]
  requirementMatches: RequirementMatch[]
  questions: GuideQuestion[]
}

export type ResumeSource = "pdf" | "text"

export interface ResumeSourceMetadata {
  resumeSource: ResumeSource
  resumeFileName?: string
}

export interface GenerateGuideInput {
  resumeText?: string
  jobDescription: string
}

export type GenerateGuideResponse =
  | { success: true; guide: InterviewGuide; source: ResumeSourceMetadata }
  | { success: false; error: string }
