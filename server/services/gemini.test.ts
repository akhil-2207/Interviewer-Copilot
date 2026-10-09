import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { generateInterviewGuide, GeminiServiceError, mapGeminiError } from "./gemini.js"

describe("Gemini error handling", () => {
  it("rejects a missing server-side API key before making a request", async () => {
    const originalKey = process.env.GEMINI_API_KEY
    process.env.GEMINI_API_KEY = ""
    try {
      await assert.rejects(
        generateInterviewGuide({ resumeText: "Resume", jobDescription: "Job" }),
        (error) => error instanceof GeminiServiceError && error.statusCode === 503 && /not configured/i.test(error.message),
      )
    } finally {
      if (originalKey === undefined) delete process.env.GEMINI_API_KEY
      else process.env.GEMINI_API_KEY = originalKey
    }
  })

  it("returns a controlled rate-limit response without retrying", () => {
    const error = mapGeminiError(Object.assign(new Error("RESOURCE_EXHAUSTED"), { status: 429 }))
    assert.equal(error.statusCode, 429)
    assert.match(error.message, /wait a moment/i)
  })

  it("returns a readable network response", () => {
    const error = mapGeminiError(new Error("fetch failed"))
    assert.equal(error.statusCode, 503)
    assert.match(error.message, /network connection/i)
  })

  it("does not expose unknown upstream details", () => {
    const error = mapGeminiError(new Error("upstream detail that should stay server-side"))
    assert.equal(error.statusCode, 502)
    assert.doesNotMatch(error.message, /upstream detail/i)
  })
})
