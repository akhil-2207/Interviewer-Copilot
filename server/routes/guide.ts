import path from "node:path"
import type { ErrorRequestHandler } from "express"
import { Router } from "express"
import multer from "multer"
import type { GenerateGuideResponse, ResumeSourceMetadata } from "../../shared/guide.js"
import { GeminiServiceError, generateInterviewGuide, PDF_ANALYSIS_ERROR } from "../services/gemini.js"

// Vercel Functions cap request bodies at 4.5 MB. Four MiB leaves room for
// multipart headers while keeping the browser and server limits identical.
const MAX_PDF_BYTES = 4 * 1024 * 1024
const MAX_TEXT_CHARACTERS = 50_000

class PdfUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PdfUploadError"
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_BYTES, files: 1 },
  fileFilter: (_request, file, callback) => {
    const isPdf = file.mimetype.toLowerCase() === "application/pdf" && path.extname(file.originalname).toLowerCase() === ".pdf"
    if (!isPdf) {
      callback(new PdfUploadError("Resume must be a PDF file."))
      return
    }
    callback(null, true)
  },
})

export const guideRouter = Router()

function bodyText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function safeFileName(value: string) {
  return path.basename(value.replaceAll("\\", "/"))
}

function isPdfBuffer(buffer: Buffer) {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-"
}

guideRouter.post("/generate-guide", upload.single("resumePdf"), async (request, response) => {
  const resumeText = bodyText(request.body?.resumeText)
  const jobDescription = bodyText(request.body?.jobDescription)
  const resumePdf = request.file

  if (!jobDescription) {
    const payload: GenerateGuideResponse = { success: false, error: "Job description is required." }
    response.status(400).json(payload)
    return
  }

  if (!resumePdf && !resumeText) {
    const payload: GenerateGuideResponse = { success: false, error: "Upload a resume PDF or paste the candidate resume." }
    response.status(400).json(payload)
    return
  }

  if (jobDescription.length > MAX_TEXT_CHARACTERS || (!resumePdf && resumeText && resumeText.length > MAX_TEXT_CHARACTERS)) {
    const payload: GenerateGuideResponse = {
      success: false,
      error: "Resume text and job description must each be 50,000 characters or fewer.",
    }
    response.status(400).json(payload)
    return
  }

  if (resumePdf && !isPdfBuffer(resumePdf.buffer)) {
    const payload: GenerateGuideResponse = { success: false, error: PDF_ANALYSIS_ERROR }
    response.status(422).json(payload)
    return
  }

  try {
    const source: ResumeSourceMetadata = resumePdf
      ? { resumeSource: "pdf", resumeFileName: safeFileName(resumePdf.originalname) }
      : { resumeSource: "text" }

    const guide = resumePdf
      ? await generateInterviewGuide({
          resumeSource: "pdf",
          resumePdf: resumePdf.buffer,
          resumeFileName: source.resumeFileName ?? "resume.pdf",
          jobDescription,
        })
      : await generateInterviewGuide({ resumeSource: "text", resumeText: resumeText!, jobDescription })

    const payload: GenerateGuideResponse = { success: true, guide, source }
    response.json(payload)
  } catch (error) {
    const statusCode = error instanceof GeminiServiceError ? error.statusCode : 500
    const message = error instanceof GeminiServiceError
      ? error.message
      : resumePdf
        ? PDF_ANALYSIS_ERROR
        : "We couldn’t generate the guide right now. Please try again."
    const payload: GenerateGuideResponse = { success: false, error: message }
    response.status(statusCode).json(payload)
  }
})

const uploadErrorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "Resume PDF must be 4 MB or smaller." : "The resume PDF could not be uploaded."
    const payload: GenerateGuideResponse = { success: false, error: message }
    response.status(400).json(payload)
    return
  }
  if (error instanceof PdfUploadError) {
    const payload: GenerateGuideResponse = { success: false, error: error.message }
    response.status(400).json(payload)
    return
  }
  next(error)
}

guideRouter.use(uploadErrorHandler)
