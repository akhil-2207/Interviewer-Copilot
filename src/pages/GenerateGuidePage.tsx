import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowRight, FileText, Info, LoaderCircle, Sparkles, WandSparkles } from "lucide-react"
import type { GenerateGuideInput } from "@shared/guide"
import { GuideLoading } from "@/components/GuideLoading"
import { demoJobDescription, demoResumeText } from "@/data/demoGuide"
import { generateGuide, GuideApiError } from "@/lib/guideApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type FormErrors = Partial<Record<keyof GenerateGuideInput, string>>

interface GenerateLocationState {
  generationInput?: GenerateGuideInput
}

const emptyForm: GenerateGuideInput = { resumeText: "", jobDescription: "" }

export function GenerateGuidePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state ?? {}) as GenerateLocationState
  const [form, setForm] = useState<GenerateGuideInput>(locationState.generationInput ?? emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [requestError, setRequestError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const requestController = useRef<AbortController | null>(null)

  useEffect(() => () => requestController.current?.abort(), [])

  const updateField = (field: keyof GenerateGuideInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (value.trim()) setErrors((current) => ({ ...current, [field]: undefined }))
    if (requestError) setRequestError(null)
  }

  const loadDemo = () => {
    setForm({ resumeText: demoResumeText, jobDescription: demoJobDescription })
    setErrors({})
    setRequestError(null)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isGenerating) return

    const nextErrors: FormErrors = {}
    if (!form.resumeText.trim()) nextErrors.resumeText = "Paste the candidate’s resume to continue."
    if (!form.jobDescription.trim()) nextErrors.jobDescription = "Paste the job description to continue."
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const generationInput = {
      resumeText: form.resumeText.trim(),
      jobDescription: form.jobDescription.trim(),
    }
    const controller = new AbortController()
    requestController.current = controller
    setRequestError(null)
    setIsGenerating(true)

    try {
      const [guide] = await Promise.all([
        generateGuide(generationInput, controller.signal),
        new Promise((resolve) => window.setTimeout(resolve, 2200)),
      ])
      if (controller.signal.aborted) return

      navigate("/candidates/akhil-mathew/guide", {
        state: { guide, generationInput },
      })
    } catch (error) {
      if (controller.signal.aborted) return
      setRequestError(error instanceof GuideApiError ? error.message : "We couldn’t generate the guide. Please try again.")
    } finally {
      if (!controller.signal.aborted) setIsGenerating(false)
    }
  }

  const candidateName = form.resumeText.split(/\r?\n/).map((line) => line.trim()).find(Boolean)

  if (isGenerating) return <GuideLoading candidateName={candidateName && candidateName.length <= 60 ? candidateName : "the candidate"} />

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Badge variant="success"><Sparkles className="h-3 w-3" /> Evidence-grounded preparation</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-ink sm:text-[36px]">Create an interview guide<span className="text-brand-dark">.</span></h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Paste the two source documents. Copilot will connect candidate evidence to the role and create personalised questions for you to review.</p>
        </div>
        <Button type="button" variant="outline" onClick={loadDemo}><WandSparkles className="h-4 w-4" /> Load demo candidate</Button>
      </motion.div>

      <form onSubmit={submit} className="mt-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-soft text-info"><FileText className="h-[18px] w-[18px]" /></div><div><label htmlFor="resume" className="text-sm font-bold text-ink">Candidate resume</label><p className="mt-0.5 text-[11px] text-muted">The candidate’s experience and evidence</p></div></div>
              <span className="text-[10px] font-semibold text-neutral-400">{form.resumeText.length.toLocaleString()} chars</span>
            </div>
            <div className="p-3 sm:p-4">
              <textarea
                id="resume"
                value={form.resumeText}
                onChange={(event) => updateField("resumeText", event.target.value)}
                placeholder="Paste candidate resume text"
                className="focus-ring min-h-[390px] w-full resize-y rounded-xl border border-transparent bg-subtle/70 p-4 text-sm leading-6 text-secondary placeholder:text-neutral-400 hover:border-line focus:bg-white"
                aria-invalid={Boolean(errors.resumeText)}
                aria-describedby={errors.resumeText ? "resume-error" : undefined}
              />
              {errors.resumeText && <p id="resume-error" className="mt-2 px-1 text-xs font-medium text-danger">{errors.resumeText}</p>}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><FileText className="h-[18px] w-[18px]" /></div><div><label htmlFor="job-description" className="text-sm font-bold text-ink">Job description</label><p className="mt-0.5 text-[11px] text-muted">Responsibilities and role requirements</p></div></div>
              <span className="text-[10px] font-semibold text-neutral-400">{form.jobDescription.length.toLocaleString()} chars</span>
            </div>
            <div className="p-3 sm:p-4">
              <textarea
                id="job-description"
                value={form.jobDescription}
                onChange={(event) => updateField("jobDescription", event.target.value)}
                placeholder="Paste job description"
                className="focus-ring min-h-[390px] w-full resize-y rounded-xl border border-transparent bg-subtle/70 p-4 text-sm leading-6 text-secondary placeholder:text-neutral-400 hover:border-line focus:bg-white"
                aria-invalid={Boolean(errors.jobDescription)}
                aria-describedby={errors.jobDescription ? "job-error" : undefined}
              />
              {errors.jobDescription && <p id="job-error" className="mt-2 px-1 text-xs font-medium text-danger">{errors.jobDescription}</p>}
            </div>
          </Card>
        </div>

        {requestError && (
          <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-warning/25 bg-warning-soft/60 p-4 text-sm text-secondary">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div><p className="font-bold text-ink">Guide generation failed</p><p className="mt-1 text-xs leading-5">{requestError} Your source documents are still here, so you can try again.</p></div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-info" /><div><p className="text-sm font-semibold text-ink">Built only from the evidence you provide</p><p className="mt-1 max-w-2xl text-xs leading-5 text-muted">Your interview guide will be based only on the candidate’s resume and the job description. Copilot does not score the candidate or make a hiring recommendation.</p></div></div>
          <Button type="submit" variant="brand" size="lg" className="shrink-0" disabled={isGenerating}>
            {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {isGenerating ? "Generating guide" : "Generate interview guide"}
          </Button>
        </div>
      </form>
    </div>
  )
}
