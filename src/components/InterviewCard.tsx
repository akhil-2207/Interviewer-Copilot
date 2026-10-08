import { ArrowRight, Clock3, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import type { Interview } from "@/data/mockData"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import { cn } from "@/lib/utils"

export function InterviewCard({ interview }: { interview: Interview }) {
  const navigate = useNavigate()
  const viewBrief = () => navigate("/candidates/akhil-mathew")
  const viewGuide = () => navigate("/candidates/akhil-mathew/guide", { state: { skipGeneration: true } })

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
      <Card className={cn(
        "relative h-full overflow-hidden p-5 transition-shadow hover:shadow-float",
        interview.prominent && "border-neutral-300",
      )}>
        {interview.prominent && <div className="absolute inset-x-0 top-0 h-[3px] bg-brand" />}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold", interview.avatarTone)}>{interview.initials}</div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-ink">{interview.name}</h3>
              <p className="mt-0.5 truncate text-xs text-muted">{interview.role}</p>
            </div>
          </div>
          <StatusBadge status={interview.status} />
        </div>

        <div className="mt-5 flex items-center gap-3 text-xs text-secondary">
          <span className="font-semibold text-ink">{interview.time}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-neutral-400" />{interview.duration}</span>
        </div>

        <div className="mt-4 min-h-[68px] rounded-xl bg-subtle p-3.5">
          <div className="flex gap-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Copilot insight</p>
              <p className="mt-1 text-xs leading-5 text-secondary">{interview.insight}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={viewBrief}>View brief</Button>
          <Button variant={interview.prominent ? "brand" : "default"} onClick={interview.status === "Guide ready" ? viewGuide : viewBrief}>
            {interview.status === "Guide ready" ? "View guide" : "Prepare"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
