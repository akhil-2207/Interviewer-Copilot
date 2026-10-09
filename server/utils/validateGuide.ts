import type {
  AreaToValidate,
  EvidenceLevel,
  GuideQuestion,
  GuideStrength,
  InterviewGuide,
  QuestionCategory,
  RequirementMatch,
} from "../../shared/guide.js"

const categories = new Set<QuestionCategory>(["technical", "behavioural", "experience", "validation"])
const evidenceLevels = new Set<EvidenceLevel>(["strong", "moderate", "weak", "missing"])

export class InvalidGuideError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidGuideError"
  }
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InvalidGuideError(`${label} must be an object.`)
  }
  return value as Record<string, unknown>
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new InvalidGuideError(`${label} must be a non-empty string.`)
  }
  return value.trim()
}

function list(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) throw new InvalidGuideError(`${label} must be an array.`)
  return value
}

export function recoverJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")

  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf("{")
    const end = trimmed.lastIndexOf("}")
    if (start === -1 || end <= start) throw new InvalidGuideError("Gemini did not return valid JSON.")

    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      throw new InvalidGuideError("Gemini returned malformed JSON that could not be recovered.")
    }
  }
}

export function validateGuide(value: unknown): InterviewGuide {
  const guide = record(value, "guide")

  const strengths: GuideStrength[] = list(guide.strengths, "strengths").map((item, index) => {
    const entry = record(item, `strengths[${index}]`)
    return {
      area: text(entry.area, `strengths[${index}].area`),
      evidence: text(entry.evidence, `strengths[${index}].evidence`),
      source: "resume",
    }
  })

  const areasToValidate: AreaToValidate[] = list(guide.areasToValidate, "areasToValidate").map((item, index) => {
    const entry = record(item, `areasToValidate[${index}]`)
    return {
      requirement: text(entry.requirement, `areasToValidate[${index}].requirement`),
      reason: text(entry.reason, `areasToValidate[${index}].reason`),
      candidateEvidence: text(entry.candidateEvidence, `areasToValidate[${index}].candidateEvidence`),
    }
  })

  const requirementMatches: RequirementMatch[] = list(guide.requirementMatches, "requirementMatches").map((item, index) => {
    const entry = record(item, `requirementMatches[${index}]`)
    const evidenceLevel = text(entry.evidenceLevel, `requirementMatches[${index}].evidenceLevel`) as EvidenceLevel
    if (!evidenceLevels.has(evidenceLevel)) throw new InvalidGuideError(`requirementMatches[${index}].evidenceLevel is invalid.`)
    return {
      requirement: text(entry.requirement, `requirementMatches[${index}].requirement`),
      candidateEvidence: text(entry.candidateEvidence, `requirementMatches[${index}].candidateEvidence`),
      evidenceLevel,
    }
  })

  const questions: GuideQuestion[] = list(guide.questions, "questions").map((item, index) => {
    const entry = record(item, `questions[${index}]`)
    const category = text(entry.category, `questions[${index}].category`).toLowerCase() as QuestionCategory
    if (!categories.has(category)) throw new InvalidGuideError(`questions[${index}].category is invalid.`)
    return {
      id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : `question-${index + 1}`,
      category,
      requirement: text(entry.requirement, `questions[${index}].requirement`),
      candidateEvidence: text(entry.candidateEvidence, `questions[${index}].candidateEvidence`),
      question: text(entry.question, `questions[${index}].question`),
      reason: text(entry.reason, `questions[${index}].reason`),
    }
  })

  if (questions.length < 5 || questions.length > 7) {
    throw new InvalidGuideError("Gemini must return between 5 and 7 interview questions.")
  }

  return {
    candidateName: text(guide.candidateName, "candidateName"),
    role: text(guide.role, "role"),
    summary: text(guide.summary, "summary"),
    strengths,
    areasToValidate,
    requirementMatches,
    questions,
  }
}
