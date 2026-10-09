import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { InvalidGuideError, recoverJson, validateGuide } from "./validateGuide.js"

const validGuide = {
  candidateName: "Test Candidate",
  role: "Graduate Software Engineer",
  summary: "Evidence-grounded summary.",
  strengths: [{ area: "APIs", evidence: "Built REST APIs.", source: "resume" }],
  areasToValidate: [{ requirement: "Kubernetes", reason: "Not shown.", candidateEvidence: "No evidence provided." }],
  requirementMatches: [{ requirement: "React", candidateEvidence: "Built React projects.", evidenceLevel: "strong" }],
  questions: Array.from({ length: 5 }, (_, index) => ({
    id: `question-${index + 1}`,
    category: index === 0 ? "validation" : "technical",
    requirement: "Backend APIs",
    candidateEvidence: "Built REST APIs for a library system.",
    question: `How did you handle API edge case ${index + 1}?`,
    reason: "Validates the depth of the resume evidence.",
  })),
}

describe("guide response validation", () => {
  it("accepts the required structure", () => {
    assert.equal(validateGuide(validGuide).questions.length, 5)
  })

  it("recovers one JSON object from a fenced response", () => {
    const recovered = recoverJson(`\`\`\`json\n${JSON.stringify(validGuide)}\n\`\`\``)
    assert.equal(validateGuide(recovered).candidateName, "Test Candidate")
  })

  it("rejects malformed JSON", () => {
    assert.throws(() => recoverJson("not json"), InvalidGuideError)
  })

  it("rejects missing question fields", () => {
    const malformed = structuredClone(validGuide)
    malformed.questions[0].reason = ""
    assert.throws(() => validateGuide(malformed), InvalidGuideError)
  })
})
