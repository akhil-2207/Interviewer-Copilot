import { ArrowRight, CalendarDays, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { interviews, stats } from "@/data/mockData"
import { StatCard } from "@/components/StatCard"
import { InterviewCard } from "@/components/InterviewCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/SectionHeader"

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline"><span className="h-1.5 w-1.5 rounded-full bg-brand-dark" /> Monday, 12 May</Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.045em] text-ink sm:text-[36px]">Good morning, Sarah<span className="text-brand-dark">.</span></h2>
          <p className="mt-2 text-sm text-muted sm:text-base">You have 3 interviews scheduled today.</p>
        </div>
        <Button variant="brand" size="lg" onClick={() => document.getElementById("upcoming")?.scrollIntoView()}>
          <CalendarDays className="h-[18px] w-[18px]" /> View today’s schedule
        </Button>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </motion.div>

      <section id="upcoming" className="mt-10 scroll-mt-24">
        <SectionHeader
          eyebrow="Today · 3 interviews"
          title="Upcoming interviews"
          description="Briefs are tailored to each candidate and role."
          action={<Button variant="ghost" className="hidden sm:flex">View calendar <ChevronRight className="h-4 w-4" /></Button>}
        />
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 xl:grid-cols-3">
          {interviews.map((interview) => <InterviewCard key={interview.id} interview={interview} />)}
        </motion.div>
      </section>

      <section className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><ArrowRight className="h-5 w-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-ink">Keep the human in the decision</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">Copilot surfaces evidence and helps you ask better questions. It never scores, ranks, or makes hiring decisions.</p>
          </div>
        </div>
        <button className="text-xs font-semibold text-secondary transition-colors hover:text-ink">How Copilot works</button>
      </section>
    </div>
  )
}
