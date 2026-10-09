import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, FileCheck2, Sparkles, WandSparkles } from "lucide-react"
import { candidateApplication } from "@/data/candidateApplication"
import { loadCandidateGuide } from "@/lib/candidateGuideSession"
import { StatCard } from "@/components/StatCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function DashboardPage() {
  const navigate = useNavigate()
  const generated = loadCandidateGuide(candidateApplication.id)
  const today = new Intl.DateTimeFormat("en-NZ", { weekday: "long", day: "numeric", month: "long" }).format(new Date())
  const stats = [
    { label: "Interviews today", value: "1", detail: `Scheduled at ${candidateApplication.interviewTime}`, icon: CalendarDays, tone: "bg-info-soft text-info" },
    { label: "Guides ready", value: generated ? "1" : "0", detail: generated ? "Generated live by Gemini" : "Guide not generated yet", icon: CheckCircle2, tone: "bg-brand-soft text-brand-dark" },
    { label: "Needs preparation", value: generated ? "0" : "1", detail: generated ? "Preparation complete" : `${candidateApplication.name} · ${candidateApplication.interviewTime}`, icon: WandSparkles, tone: "bg-warning-soft text-warning" },
    { label: "Next interview", value: candidateApplication.interviewTime, detail: `${candidateApplication.role} · ${candidateApplication.interviewDuration}`, icon: Clock3, tone: "bg-subtle text-secondary" },
  ]

  const openGuide = () => {
    if (!generated) {
      navigate(`/generate?candidate=${candidateApplication.id}`)
      return
    }
    navigate("/guide", {
      state: {
        guide: generated.guide,
        source: generated.source,
        generationInput: {
          candidateId: candidateApplication.id,
          resumeMode: "pdf",
          jobDescription: candidateApplication.jobDescription,
        },
      },
    })
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Badge variant="outline"><span className="h-1.5 w-1.5 rounded-full bg-brand-dark" /> {today}</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-ink sm:text-[36px]">{greeting()}<span className="text-brand-dark">.</span></h2>
          <p className="mt-2 text-sm text-muted sm:text-base">You have one interview scheduled today.</p>
        </div>
        <Button variant="brand" size="lg" onClick={() => document.getElementById("today-interviews")?.scrollIntoView({ behavior: "smooth" })}><CalendarDays className="h-[18px] w-[18px]" /> View today’s schedule</Button>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </motion.div>

      <section id="today-interviews" className="mt-10 scroll-mt-24">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dark">Today · 1 interview</p><h3 className="mt-1 text-xl font-bold text-ink">Upcoming interview</h3><p className="mt-1 text-sm text-muted">Candidate source documents and preparation status at a glance.</p></div>{generated && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Gemini guide ready</Badge>}</div>

        <Card className="overflow-hidden">
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_minmax(180px,0.65fr)_minmax(260px,1fr)_auto] lg:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-info-soft text-base font-bold text-info">{candidateApplication.initials}</div>
            <div><h3 className="text-lg font-bold text-ink">{candidateApplication.name}</h3><p className="mt-1 text-sm text-secondary">{candidateApplication.role}</p><p className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink"><Clock3 className="h-3.5 w-3.5 text-muted" /> {candidateApplication.interviewTime} · {candidateApplication.interviewDuration}</p></div>
            <div className="rounded-2xl bg-subtle p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{generated ? <Sparkles className="h-3.5 w-3.5 text-brand-dark" /> : <FileCheck2 className="h-3.5 w-3.5 text-info" />}{generated ? "Live Gemini briefing" : "Preparation status"}</div>
              <p className="mt-2 text-xs leading-5 text-secondary">{generated ? generated.guide.summary : `${candidateApplication.resumeFileName} and the role description are ready. Generate the guide before the interview.`}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end"><Button variant="outline" onClick={() => navigate(`/candidates/${candidateApplication.id}`)}>View candidate</Button><Button variant="brand" onClick={openGuide}>{generated ? "View guide" : "Prepare"} <ArrowRight className="h-4 w-4" /></Button></div>
          </div>
        </Card>
      </section>

      <section className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-white p-5"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark" /><div><h3 className="text-sm font-bold text-ink">AI supports preparation—the interviewer decides</h3><p className="mt-1 text-xs leading-5 text-muted">Copilot organises evidence and suggests questions. It never scores, ranks, or makes a hiring recommendation.</p></div></section>
    </div>
  )
}
