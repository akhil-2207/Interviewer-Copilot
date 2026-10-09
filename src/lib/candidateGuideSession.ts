import type { InterviewGuide, ResumeSourceMetadata } from "@shared/guide"

const STORAGE_KEY = "interviewer-copilot:candidate-guide"

export interface StoredCandidateGuide {
  candidateId: string
  guide: InterviewGuide
  source: ResumeSourceMetadata
}

export function saveCandidateGuide(value: StoredCandidateGuide) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function loadCandidateGuide(candidateId: string): StoredCandidateGuide | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<StoredCandidateGuide>
    if (value.candidateId !== candidateId || !value.guide || !value.source) return null
    return value as StoredCandidateGuide
  } catch {
    return null
  }
}
