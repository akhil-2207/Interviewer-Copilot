import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildGeminiContents, generateInterviewGuide, GeminiServiceError, mapGeminiError, PDF_ANALYSIS_ERROR } from "./gemini.js"

describe("Gemini error handling", () => {
  it("rejects a missing server-side API key before making a request", async () => {
    const originalKey = process.env.GEMINI_API_KEY
    process.env.GEMINI_API_KEY = ""
    try {
      await assert.rejects(
        generateInterviewGuide({ resumeSource: "text", resumeText: "Resume", jobDescription: "Job" }),
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

  it("maps a PDF-processing failure to the explicit PDF fallback message", () => {
    const error = mapGeminiError(new Error("document could not be processed"), "pdf")
    assert.equal(error.statusCode, 422)
    assert.equal(error.message, PDF_ANALYSIS_ERROR)
  })
})

describe("Gemini multimodal request", () => {
  it("sends the actual PDF bytes as one inline application/pdf part", () => {
    const pdf = Buffer.from("%PDF-1.7\nresume bytes")
    const contents = buildGeminiContents({
      resumeSource: "pdf",
      resumePdf: pdf,
      resumeFileName: "candidate.pdf",
      jobDescription: "Graduate Software Engineer",
    })

    assert.ok(Array.isArray(contents))
    assert.equal(contents.length, 2)
    assert.deepEqual(contents[0].inlineData, {
      data: pdf.toString("base64"),
      mimeType: "application/pdf",
    })
    assert.match(contents[1].text ?? "", /Graduate Software Engineer/)
  })

  it("keeps pasted resume text in the text-only path", () => {
    const contents = buildGeminiContents({
      resumeSource: "text",
      resumeText: "Built a React application",
      jobDescription: "Graduate Software Engineer",
    })
    assert.equal(typeof contents, "string")
    assert.match(contents as string, /Built a React application/)
  })
})
