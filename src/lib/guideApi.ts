import type { GenerateGuideResponse, InterviewGuide, ResumeSourceMetadata } from "@shared/guide"

export interface GenerateGuideRequest {
  jobDescription: string
  resumePdf?: File
  resumeText?: string
}

export interface GeneratedGuideResult {
  guide: InterviewGuide
  source: ResumeSourceMetadata
}

export class GuideApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GuideApiError"
  }
}

export async function generateGuide(input: GenerateGuideRequest, signal?: AbortSignal): Promise<GeneratedGuideResult> {
  const body = new FormData()
  body.append("jobDescription", input.jobDescription)
  if (input.resumePdf) body.append("resumePdf", input.resumePdf, input.resumePdf.name)
  else if (input.resumeText) body.append("resumeText", input.resumeText)

  let response: Response
  try {
    response = await fetch("/api/generate-guide", {
      method: "POST",
      body,
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error
    throw new GuideApiError("The guide service is unavailable. Check that the backend is running.")
  }

  let payload: GenerateGuideResponse
  try {
    payload = await response.json() as GenerateGuideResponse
  } catch {
    throw new GuideApiError("The guide service returned an unreadable response.")
  }

  if (!response.ok || !payload.success) {
    throw new GuideApiError(payload.success ? "The guide could not be generated." : payload.error)
  }

  return { guide: payload.guide, source: payload.source }
}
