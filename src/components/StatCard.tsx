import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

export function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: LucideIcon; tone: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
      <Card className="h-full p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-muted">{label}</p><p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-ink">{value}</p></div><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon className="h-[18px] w-[18px]" strokeWidth={2} /></div></div>
        <p className="mt-3 text-[11px] text-neutral-500">{detail}</p>
      </Card>
    </motion.div>
  )
}
