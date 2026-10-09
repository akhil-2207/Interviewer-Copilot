import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, ExternalLink, FileCheck2, FileText, ShieldCheck, Sparkles } from "lucide-react"
import { candidateApplication } from "@/data/candidateApplication"
import { loadCandidateGuide } from "@/lib/candidateGuideSession"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function CandidatePage() {
  const navigate = useNavigate()
  const generated = loadCandidateGuide(candidateApplication.id)

  const openGuide = () => {
    if (!generated) {
      navigate(`/generate?candidate=${candidateApplication.id}`)
      return
    }
    navigate("/guide", {
      state: {
        guide: generated.guide,
        source: generated.source,
        generationInput: { candidateId: candidateApplication.id, resumeMode: "pdf", jobDescription: candidateApplication.jobDescription },
      },
    })
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <button onClick={() => navigate("/")} className="focus-ring mb-5 flex items-center gap-2 rounded-lg text-xs font-semibold text-muted transition-colors hover:text-ink"><ArrowLeft className="h-4 w-4" /> Back to dashboard</button>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-info-soft text-lg font-bold text-info">{candidateApplication.initials}</div>
            <div><div className="flex flex-wrap gap-2"><Badge variant="success"><FileCheck2 className="h-3 w-3" /> Application received</Badge>{generated && <Badge variant="info"><CheckCircle2 className="h-3 w-3" /> Guide ready</Badge>}</div><h2 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-ink sm:text-3xl">{candidateApplication.name}</h2><p className="mt-1 text-sm text-secondary">{candidateApplication.role}</p><p className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted"><Clock3 className="h-3.5 w-3.5" /> Today · {candidateApplication.interviewTime} · {candidateApplication.interviewDuration}</p></div>
          </div>
          <Button variant="brand" size="lg" onClick={openGuide}>{generated ? <CheckCircle2 className="h-[18px] w-[18px]" /> : <Sparkles className="h-[18px] w-[18px]" />} {generated ? "View interview guide" : "Prepare interview guide"} <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><FileText className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-brand-dark">Candidate source</p><h3 className="mt-0.5 text-base font-bold text-ink">Submitted resume</h3></div></div>
          <div className="mt-5 rounded-2xl border border-line bg-subtle/60 p-4">
            <div className="flex items-center justify-between gap-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-ink">{candidateApplication.resumeFileName}</p><p className="mt-1 text-xs text-muted">PDF · Supplied with the application</p></div><Badge variant="success">Available</Badge></div>
          </div>
          <a href={candidateApplication.resumeUrl} target="_blank" rel="noreferrer" className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-secondary hover:text-ink">View submitted PDF <ExternalLink className="h-3.5 w-3.5" /></a>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-info-soft/60 p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-info" /><p className="text-xs leading-5 text-secondary">The guide is generated only when requested. The PDF itself is sent to Gemini as document input.</p></div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-soft text-info"><BriefcaseBusiness className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-info">Applied role</p><h3 className="mt-0.5 text-base font-bold text-ink">{candidateApplication.role}</h3></div></div>
          <div className="mt-5 max-h-[340px] overflow-y-auto whitespace-pre-line rounded-2xl border border-line bg-subtle/60 p-4 text-sm leading-6 text-secondary">{candidateApplication.jobDescription}</div>
        </Card>
      </div>
    </div>
  )
}
