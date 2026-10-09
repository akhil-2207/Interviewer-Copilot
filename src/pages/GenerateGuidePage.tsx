import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  AlertTriangle, ArrowRight, CheckCircle2, FileText, Info, LoaderCircle,
  Sparkles, UploadCloud, X,
} from "lucide-react"
import type { ResumeSource } from "@shared/guide"
import { GuideLoading } from "@/components/GuideLoading"
import { candidateApplication } from "@/data/candidateApplication"
import { generateGuide, GuideApiError } from "@/lib/guideApi"
import { saveCandidateGuide } from "@/lib/candidateGuideSession"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const MAX_PDF_BYTES = 10 * 1024 * 1024

export interface SavedGenerationInput {
  candidateId?: string
  resumeMode: ResumeSource
  resumePdf?: File
  resumeText?: string
  jobDescription: string
}

interface GenerateLocationState {
  generationInput?: SavedGenerationInput
}

interface FormErrors {
  resume?: string
  jobDescription?: string
}

function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function validatePdf(file: File) {
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) return "Choose a PDF file."
  if (file.size > MAX_PDF_BYTES) return "Resume PDF must be 10 MB or smaller."
  if (file.size === 0) return "This PDF is empty. Choose another file."
  return null
}

export function GenerateGuidePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const saved = ((location.state ?? {}) as GenerateLocationState).generationInput
  const candidateId = searchParams.get("candidate")
  const linkedCandidate = candidateId === candidateApplication.id ? candidateApplication : null
  const [resumeMode, setResumeMode] = useState<ResumeSource>(saved?.resumeMode ?? "pdf")
  const [resumePdf, setResumePdf] = useState<File | null>(saved?.resumePdf ?? null)
  const [resumeText, setResumeText] = useState(saved?.resumeText ?? "")
  const [jobDescription, setJobDescription] = useState(saved?.jobDescription ?? linkedCandidate?.jobDescription ?? "")
  const [errors, setErrors] = useState<FormErrors>({})
  const [requestError, setRequestError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoadingSubmittedResume, setIsLoadingSubmittedResume] = useState(Boolean(linkedCandidate && !saved?.resumePdf))
  const [isSubmittedResume, setIsSubmittedResume] = useState(Boolean(linkedCandidate && saved?.resumePdf))
  const [isGenerating, setIsGenerating] = useState(false)
  const requestController = useRef<AbortController | null>(null)

  useEffect(() => () => requestController.current?.abort(), [])

  useEffect(() => {
    if (!linkedCandidate || saved?.resumePdf) return
    let cancelled = false
    setIsLoadingSubmittedResume(true)

    fetch(linkedCandidate.resumeUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Submitted resume could not be loaded")
        return response.blob()
      })
      .then((blob) => {
        if (cancelled) return
        const file = new File([blob], linkedCandidate.resumeFileName, { type: "application/pdf" })
        const error = validatePdf(file)
        if (error) throw new Error(error)
        setResumePdf(file)
        setIsSubmittedResume(true)
        setErrors((current) => ({ ...current, resume: undefined }))
      })
      .catch(() => {
        if (!cancelled) setErrors((current) => ({ ...current, resume: "We couldn’t load the candidate’s submitted PDF. Try again or upload it manually." }))
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSubmittedResume(false)
      })

    return () => { cancelled = true }
  }, [linkedCandidate, saved?.resumePdf])

  const clearMessages = () => {
    setErrors({})
    setRequestError(null)
  }

  const chooseMode = (mode: ResumeSource) => {
    setResumeMode(mode)
    clearMessages()
  }

  const acceptFile = (file: File | undefined) => {
    if (!file) return
    const error = validatePdf(file)
    if (error) {
      setResumePdf(null)
      setErrors((current) => ({ ...current, resume: error }))
      return
    }
    setResumePdf(file)
    setIsSubmittedResume(false)
    clearMessages()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isGenerating) return

    const nextErrors: FormErrors = {}
    if (resumeMode === "pdf" && !resumePdf) nextErrors.resume = "Upload the candidate’s PDF resume to continue."
    if (resumeMode === "text" && !resumeText.trim()) nextErrors.resume = "Paste the candidate’s resume to continue."
    if (!jobDescription.trim()) nextErrors.jobDescription = "Paste the job description to continue."
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const generationInput: SavedGenerationInput = {
      candidateId: linkedCandidate?.id,
      resumeMode,
      resumePdf: resumeMode === "pdf" ? resumePdf ?? undefined : undefined,
      resumeText: resumeMode === "text" ? resumeText.trim() : undefined,
      jobDescription: jobDescription.trim(),
    }
    const controller = new AbortController()
    requestController.current = controller
    setRequestError(null)
    setIsGenerating(true)

    try {
      const result = await generateGuide({
        jobDescription: generationInput.jobDescription,
        resumePdf: generationInput.resumePdf,
        resumeText: generationInput.resumeText,
      }, controller.signal)
      if (controller.signal.aborted) return

      if (linkedCandidate) {
        saveCandidateGuide({ candidateId: linkedCandidate.id, guide: result.guide, source: result.source })
      }

      navigate("/guide", {
        state: { guide: result.guide, source: result.source, generationInput },
      })
    } catch (error) {
      if (controller.signal.aborted) return
      setRequestError(error instanceof GuideApiError ? error.message : "We couldn’t generate the guide. Please try again.")
    } finally {
      if (!controller.signal.aborted) setIsGenerating(false)
    }
  }

  const candidateName = resumeMode === "text"
    ? resumeText.split(/\r?\n/).map((line) => line.trim()).find(Boolean)
    : linkedCandidate?.name

  if (isGenerating) {
    return <GuideLoading candidateName={candidateName && candidateName.length <= 60 ? candidateName : "the candidate"} resumeSource={resumeMode} />
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <Badge variant="success"><Sparkles className="h-3 w-3" /> {linkedCandidate ? "Candidate application loaded" : "Evidence-grounded preparation"}</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-ink sm:text-[36px]">{linkedCandidate ? `Prepare ${linkedCandidate.name}` : "Create an interview guide"}<span className="text-brand-dark">.</span></h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{linkedCandidate ? "The resume submitted with this application and its job description are ready below. Gemini will analyse the PDF itself when you generate the guide." : "Provide a resume PDF or paste the resume text, then add the role. Gemini will connect candidate evidence to the requirements and prepare personalised questions."}</p>
        </div>
      </motion.div>

      <form onSubmit={submit} className="mt-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-soft text-info"><FileText className="h-[18px] w-[18px]" /></div>
                <div><p className="text-sm font-bold text-ink">Candidate resume</p><p className="mt-0.5 text-[11px] text-muted">Choose one source for Gemini to analyse</p></div>
              </div>
              <div className="mt-4 grid grid-cols-2 rounded-xl bg-subtle p-1" role="tablist" aria-label="Resume input method">
                <button type="button" role="tab" aria-selected={resumeMode === "pdf"} onClick={() => chooseMode("pdf")} className={cn("focus-ring rounded-lg px-3 py-2 text-xs font-bold transition", resumeMode === "pdf" ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink")}><UploadCloud className="mr-1.5 inline h-3.5 w-3.5" />Upload PDF</button>
                <button type="button" role="tab" aria-selected={resumeMode === "text"} onClick={() => chooseMode("text")} className={cn("focus-ring rounded-lg px-3 py-2 text-xs font-bold transition", resumeMode === "text" ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink")}><FileText className="mr-1.5 inline h-3.5 w-3.5" />Paste Text</button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {resumeMode === "pdf" ? (
                <div>
                  <input id="resume-pdf" type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => { acceptFile(event.target.files?.[0]); event.currentTarget.value = "" }} />
                  {isLoadingSubmittedResume ? (
                    <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border border-line bg-subtle/50 px-6 text-center">
                      <LoaderCircle className="h-8 w-8 animate-spin text-brand-dark" />
                      <p className="mt-4 text-sm font-bold text-ink">Loading submitted resume</p>
                      <p className="mt-1 text-xs text-muted">Retrieving the PDF attached to this application</p>
                    </div>
                  ) : !resumePdf ? (
                    <label
                      htmlFor="resume-pdf"
                      onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
                      onDragOver={(event) => event.preventDefault()}
                      onDragLeave={(event) => { event.preventDefault(); if (event.currentTarget === event.target) setIsDragging(false) }}
                      onDrop={(event) => { event.preventDefault(); setIsDragging(false); acceptFile(event.dataTransfer.files?.[0]) }}
                      className={cn("focus-ring flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition", isDragging ? "border-brand-dark bg-brand-soft/70" : "border-line bg-subtle/50 hover:border-brand-dark/50 hover:bg-brand-soft/30", errors.resume && "border-danger/50")}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-dark shadow-card"><UploadCloud className="h-7 w-7" /></div>
                      <p className="mt-5 text-base font-bold text-ink">Upload candidate resume</p>
                      <p className="mt-2 text-xs text-muted">Drag and drop or <span className="font-semibold text-brand-dark">click to browse</span></p>
                      <p className="mt-5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">PDF only · Max 10 MB</p>
                    </label>
                  ) : (
                    <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border border-brand-dark/25 bg-brand-soft/35 p-6 text-center">
                      <div className="relative flex h-16 w-14 items-center justify-center rounded-xl bg-white text-danger shadow-card"><FileText className="h-8 w-8" /><CheckCircle2 className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-white fill-brand-dark text-white" /></div>
                      <p className="mt-6 max-w-full truncate text-sm font-bold text-ink">{resumePdf.name}</p>
                      <p className="mt-1 text-xs text-muted">{fileSize(resumePdf.size)}</p>
                      <Badge variant="success" className="mt-4"><CheckCircle2 className="h-3 w-3" /> {isSubmittedResume ? "Submitted with application" : "Ready"}</Badge>
                      <div className="mt-6 flex gap-2">
                        <label htmlFor="resume-pdf" className="focus-ring inline-flex cursor-pointer items-center rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-subtle">Replace file</label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setResumePdf(null); setIsSubmittedResume(false); clearMessages() }}><X className="h-3.5 w-3.5" /> Remove</Button>
                      </div>
                    </div>
                  )}
                  {errors.resume && <p role="alert" className="mt-2 px-1 text-xs font-medium text-danger">{errors.resume}</p>}
                </div>
              ) : (
                <div>
                  <div className="mb-3"><label htmlFor="resume-text" className="text-sm font-bold text-ink">Paste candidate resume</label><p className="mt-1 text-xs text-muted">Use this option when a PDF is not available.</p></div>
                  <textarea id="resume-text" value={resumeText} onChange={(event) => { setResumeText(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, resume: undefined })); setRequestError(null) }} placeholder="Paste candidate resume text" className="focus-ring min-h-[285px] w-full resize-y rounded-xl border border-transparent bg-subtle/70 p-4 text-sm leading-6 text-secondary placeholder:text-neutral-400 hover:border-line focus:bg-white" aria-invalid={Boolean(errors.resume)} />
                  <div className="mt-2 flex justify-between"><p className="text-xs font-medium text-danger">{errors.resume}</p><span className="text-[10px] font-semibold text-neutral-400">{resumeText.length.toLocaleString()} chars</span></div>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><FileText className="h-[18px] w-[18px]" /></div><div><label htmlFor="job-description" className="text-sm font-bold text-ink">Job description</label><p className="mt-0.5 text-[11px] text-muted">Responsibilities and role requirements</p></div></div>
              <span className="text-[10px] font-semibold text-neutral-400">{jobDescription.length.toLocaleString()} chars</span>
            </div>
            <div className="p-3 sm:p-4">
              <textarea id="job-description" value={jobDescription} onChange={(event) => { setJobDescription(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, jobDescription: undefined })); setRequestError(null) }} placeholder="Paste job description" className="focus-ring min-h-[390px] w-full resize-y rounded-xl border border-transparent bg-subtle/70 p-4 text-sm leading-6 text-secondary placeholder:text-neutral-400 hover:border-line focus:bg-white" aria-invalid={Boolean(errors.jobDescription)} />
              {errors.jobDescription && <p role="alert" className="mt-2 px-1 text-xs font-medium text-danger">{errors.jobDescription}</p>}
            </div>
          </Card>
        </div>

        {requestError && (
          <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-warning/25 bg-warning-soft/60 p-4 text-sm text-secondary">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div><p className="font-bold text-ink">Guide generation failed</p><p className="mt-1 text-xs leading-5">{requestError}</p></div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-info" /><div><p className="text-sm font-semibold text-ink">Built only from the evidence you provide</p><p className="mt-1 max-w-2xl text-xs leading-5 text-muted">Gemini analyses the selected resume source with the job description. Copilot does not score the candidate or make a hiring recommendation.</p></div></div>
          <Button type="submit" variant="brand" size="lg" className="shrink-0" disabled={isGenerating}>
            {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {isGenerating ? "Generating guide" : "Generate interview guide"}
          </Button>
        </div>
      </form>
    </div>
  )
}
