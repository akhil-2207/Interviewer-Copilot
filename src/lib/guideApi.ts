import type { GenerateGuideInput, GenerateGuideResponse, InterviewGuide } from "@shared/guide"

export class GuideApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GuideApiError"
  }
}

export async function generateGuide(input: GenerateGuideInput, signal?: AbortSignal): Promise<InterviewGuide> {
  let response: Response
  try {
    response = await fetch("/api/generate-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
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

  return payload.guide
}
