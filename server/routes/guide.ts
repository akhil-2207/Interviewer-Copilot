import { Router } from "express"
import type { GenerateGuideInput, GenerateGuideResponse } from "../../shared/guide.js"
import { GeminiServiceError, generateInterviewGuide } from "../services/gemini.js"

export const guideRouter = Router()

function bodyText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

guideRouter.post("/generate-guide", async (request, response) => {
  const resumeText = bodyText(request.body?.resumeText)
  const jobDescription = bodyText(request.body?.jobDescription)

  if (!resumeText || !jobDescription) {
    const payload: GenerateGuideResponse = {
      success: false,
      error: !resumeText && !jobDescription
        ? "Candidate resume and job description are required."
        : !resumeText
          ? "Candidate resume is required."
          : "Job description is required.",
    }
    response.status(400).json(payload)
    return
  }

  if (resumeText.length > 50_000 || jobDescription.length > 50_000) {
    const payload: GenerateGuideResponse = {
      success: false,
      error: "Resume and job description must each be 50,000 characters or fewer.",
    }
    response.status(400).json(payload)
    return
  }

  try {
    const input: GenerateGuideInput = { resumeText, jobDescription }
    const guide = await generateInterviewGuide(input)
    const payload: GenerateGuideResponse = { success: true, guide }
    response.json(payload)
  } catch (error) {
    const statusCode = error instanceof GeminiServiceError ? error.statusCode : 500
    const message = error instanceof GeminiServiceError
      ? error.message
      : "We couldn’t generate the guide right now. Please try again."
    const payload: GenerateGuideResponse = { success: false, error: message }
    response.status(statusCode).json(payload)
  }
})
