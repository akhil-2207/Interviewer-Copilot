import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft, Check, CheckCircle2, CircleAlert, Clock3, Download, FileText,
  MessageSquareText, MoreHorizontal, Play, ShieldCheck, Sparkles, Target,
} from "lucide-react"
import { loadingSteps, questions, strongAreas, validationAreas } from "@/data/mockData"
import { LoadingStep } from "@/components/LoadingStep"
import { QuestionCard } from "@/components/QuestionCard"
import { SectionHeader } from "@/components/SectionHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function GuideLoading({ onComplete }: { onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step >= loadingSteps.length - 1) {
          window.clearInterval(timer)
          window.setTimeout(onComplete, 420)
          return step
        }
        return step + 1
      })
    }, 470)
    return () => window.clearInterval(timer)
  }, [onComplete])

  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 shadow-float sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
          <motion.div animate={{ rotate: [0, 8, -4, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}><Sparkles className="h-7 w-7" /></motion.div>
        </div>
        <div className="mt-6 text-center">
          <Badge variant="success">Building from CV + role</Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-[-0.035em] text-ink">Creating Akhil’s interview guide</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Connecting candidate evidence to the role so you can ask sharper, more relevant questions.</p>
        </div>
        <div className="mt-7 space-y-1">
          {loadingSteps.map((step, index) => <LoadingStep key={step} label={step} index={index} state={index < activeStep ? "done" : index === activeStep ? "active" : "waiting"} />)}
        </div>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-subtle"><motion.div className="h-full rounded-full bg-brand-dark" animate={{ width: `${((activeStep + 1) / loadingSteps.length) * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }} /></div>
        <p className="mt-3 text-center text-[11px] text-muted">This usually takes just a few seconds</p>
      </motion.div>
    </div>
  )
}

function GuideContent() {
  const navigate = useNavigate()
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={() => navigate("/candidates/akhil-mathew")} className="focus-ring flex items-center gap-2 rounded-lg text-xs font-semibold text-muted transition-colors hover:text-ink"><ArrowLeft className="h-4 w-4" /> Candidate brief</button>
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="hidden sm:flex"><Download className="h-3.5 w-3.5" /> Export</Button><Button variant="outline" size="icon" className="h-9 w-9"><MoreHorizontal className="h-4 w-4" /></Button></div>
      </div>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-card sm:p-8">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <Badge className="bg-brand text-ink"><CheckCircle2 className="h-3 w-3" /> Ready for interview</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Interview Guide</h2>
            <p className="mt-2 text-sm text-neutral-300">Akhil Mathew <span className="mx-2 text-neutral-600">·</span> Graduate Software Engineer</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"><p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Interview</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4 text-brand" />10:30 AM today</p></div>
            <Button variant="brand" size="lg"><Play className="h-4 w-4 fill-current" /> Start interview</Button>
          </div>
        </div>
      </motion.section>

      <section className="mt-7">
        <Card className="p-6 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><FileText className="h-5 w-5" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dark">Before you start</p>
              <h2 className="mt-1 text-lg font-bold text-ink">Your 60-second briefing</h2>
              <p className="mt-3 text-sm leading-6 text-secondary">Akhil shows solid evidence across backend development, React, TypeScript and databases, supported by internship and project work. Go deeper on how he designed API workflows and made technical trade-offs. His AWS experience appears limited to S3 and CloudFront, so validate whether he understands production backend deployment. Kubernetes and system design are open areas—explore learning approach rather than expecting senior-level depth.</p>
            </div>
            <div className="rounded-xl bg-subtle px-4 py-3 text-center"><p className="text-xl font-bold text-ink">6</p><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Questions</p></div>
          </div>
        </Card>
      </section>

      <section className="mt-10">
        <SectionHeader eyebrow="Evidence map" title="Strong areas to explore" description="Use these strengths to understand depth, ownership and judgment." />
        <div className="grid gap-4 lg:grid-cols-3">
          {strongAreas.map((area, index) => (
            <motion.div key={area.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Card className="h-full p-5">
                <div className="flex items-start justify-between gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><Check className="h-4 w-4" strokeWidth={3} /></div><Badge variant="success">{area.strength} evidence</Badge></div>
                <h3 className="mt-4 text-base font-bold text-ink">{area.title}</h3>
                <div className="mt-4 border-t border-line pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Role requirement</p><p className="mt-1.5 text-xs leading-5 text-secondary">{area.requirement}</p></div>
                <div className="mt-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Candidate evidence</p><p className="mt-1.5 text-xs leading-5 text-secondary">{area.evidence}</p></div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader eyebrow="Probe thoughtfully" title="Areas to validate" description="Evidence is limited here. Use the interview to build a clearer picture." />
        <div className="grid gap-4 lg:grid-cols-2">
          {validationAreas.map((area) => (
            <Card key={area.requirement} className="border-warning/20 p-5 sm:p-6">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-soft text-warning"><CircleAlert className="h-[18px] w-[18px]" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-warning">Requirement</p><h3 className="mt-0.5 text-sm font-bold text-ink">{area.requirement}</h3></div></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-subtle p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Candidate evidence</p><p className="mt-2 text-xs leading-5 text-secondary">{area.evidence}</p></div><div className="rounded-xl bg-warning-soft/50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-warning">Interview objective</p><p className="mt-2 text-xs leading-5 text-secondary">{area.objective}</p></div></div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Personalised for Akhil"
          title="Suggested interview questions"
          description="Open a question to see the evidence behind it and why it matters."
          action={<Badge variant="info"><MessageSquareText className="h-3 w-3" /> 6 questions</Badge>}
        />
        <div className="space-y-3">
          {(showAllQuestions ? questions : questions.slice(0, 4)).map((question, index) => <QuestionCard key={question.id} question={question} defaultOpen={index === 0} />)}
        </div>
        {!showAllQuestions && <Button variant="outline" className="mt-4 w-full" onClick={() => setShowAllQuestions(true)}>Show 2 more questions</Button>}
      </section>

      <section className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-subtle/60 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark" /><div><h3 className="text-sm font-bold text-ink">You make the hiring decision</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-muted">This guide organises evidence and suggests questions. It does not score the candidate or recommend an outcome.</p></div></div>
        <Button variant="ghost" size="sm"><Target className="h-4 w-4" /> Interview principles</Button>
      </section>
    </div>
  )
}

export function GuidePage() {
  const location = useLocation()
  const [isGenerating, setIsGenerating] = useState(!location.state?.skipGeneration)

  if (isGenerating) return <GuideLoading onComplete={() => setIsGenerating(false)} />
  return <GuideContent />
}
