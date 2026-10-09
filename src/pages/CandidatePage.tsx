import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft, ArrowRight, Braces, BriefcaseBusiness, Check, CircleAlert, Cloud, Code2,
  FileText, Lightbulb, PanelsTopLeft, Sparkles, Target, UsersRound,
} from "lucide-react"
import { candidate } from "@/data/mockData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/SectionHeader"

const iconMap = { code: Code2, layout: PanelsTopLeft, cloud: Cloud, braces: Braces, bulb: Lightbulb }
const itemVariant = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export function CandidatePage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <button onClick={() => navigate("/")} className="focus-ring mb-5 flex items-center gap-2 rounded-lg text-xs font-semibold text-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-brand-soft/70" />
        <div className="relative flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#DFF1FF] text-xl font-bold text-[#23638A] sm:h-20 sm:w-20">{candidate.initials}</div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-brand-dark" /> Interview today</Badge>
                <span className="text-xs text-muted">{candidate.time} · 45 minutes</span>
              </div>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-ink sm:text-3xl">{candidate.name}</h2>
              <p className="mt-1 text-sm text-secondary sm:text-base">{candidate.role}</p>
            </div>
          </div>
          <Button variant="brand" size="lg" onClick={() => navigate("/generate")}>
            <Sparkles className="h-[18px] w-[18px]" /> Generate interview guide <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative mt-7 grid grid-cols-3 gap-2 border-t border-line pt-6 sm:flex sm:gap-3">
          <div className="rounded-xl bg-brand-soft px-3 py-2.5 sm:min-w-[175px]"><p className="text-lg font-bold text-ink">8/10</p><p className="text-[11px] text-[#4B7C39]">requirements covered</p></div>
          <div className="rounded-xl bg-warning-soft px-3 py-2.5 sm:min-w-[175px]"><p className="text-lg font-bold text-ink">2</p><p className="text-[11px] text-[#996007]">areas to validate</p></div>
          <div className="rounded-xl bg-info-soft px-3 py-2.5 sm:min-w-[175px]"><p className="text-lg font-bold text-ink">6</p><p className="text-[11px] text-[#2D5AA7]">suggested questions</p></div>
        </div>
      </motion.section>

      <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="show" className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
        <div className="space-y-6">
          <motion.div variants={itemVariant}>
            <Card className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><FileText className="h-5 w-5" /></div>
                <div>
                  <SectionHeader eyebrow="Quick read" title="60-second candidate summary" />
                  <p className="text-[15px] leading-7 text-secondary">{candidate.summary}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariant}>
            <Card className="p-6 sm:p-7">
              <SectionHeader title="Relevant experience" description="Evidence connected to this role." />
              <div className="space-y-3">
                {candidate.experience.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap]
                  return (
                    <div key={item.title} className="flex gap-4 rounded-xl border border-line p-4 transition-colors hover:bg-subtle/60">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-subtle text-secondary"><Icon className="h-[18px] w-[18px]" /></div>
                      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold text-ink">{item.title}</h3><span className="text-[11px] text-muted">{item.period}</span></div><p className="mt-1.5 text-sm text-muted">{item.body}</p></div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariant}>
            <Card className="p-6 sm:p-7">
              <SectionHeader title="Skills" description="Mentioned across CV and project experience." />
              <div className="flex flex-wrap gap-2">{candidate.skills.map((skill) => <span key={skill} className="rounded-lg border border-line bg-subtle/70 px-3 py-2 text-xs font-semibold text-secondary">{skill}</span>)}</div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariant}>
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><Target className="h-[18px] w-[18px]" /></div><h2 className="text-base font-bold text-ink">Strong alignment</h2></div>
              <div className="space-y-3">{candidate.strengths.map((strength) => <div key={strength} className="flex items-center gap-3"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-brand-dark"><Check className="h-3 w-3" strokeWidth={3} /></span><span className="text-sm text-secondary">{strength}</span></div>)}</div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariant}>
            <Card className="border-warning/20 p-6">
              <div className="mb-5 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-soft text-warning"><CircleAlert className="h-[18px] w-[18px]" /></div><h2 className="text-base font-bold text-ink">Areas to validate</h2></div>
              <div className="space-y-3">{candidate.validations.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-warning-soft/60 px-3.5 py-3"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" /><span className="text-sm text-secondary">{item}</span></div>)}</div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariant}>
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-soft text-info"><UsersRound className="h-[18px] w-[18px]" /></div><h2 className="text-base font-bold text-ink">Suggested interview focus</h2></div>
              <div className="grid gap-3">
                {candidate.focus.map((item) => { const Icon = iconMap[item.icon as keyof typeof iconMap]; return <div key={item.title} className="flex items-center gap-3 rounded-xl border border-line p-3.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-subtle text-secondary"><Icon className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-ink">{item.title}</p><p className="mt-0.5 text-[11px] text-muted">{item.body}</p></div></div> })}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
