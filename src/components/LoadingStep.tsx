import { Check, LoaderCircle } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function LoadingStep({ label, state, index }: { label: string; state: "waiting" | "active" | "done"; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300", state === "active" && "bg-subtle")}
    >
      <div className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300",
        state === "waiting" && "border-line bg-white text-neutral-400",
        state === "active" && "border-brand bg-brand-soft text-brand-dark",
        state === "done" && "border-brand-dark bg-brand text-ink",
      )}>
        {state === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : state === "active" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : index + 1}
      </div>
      <span className={cn("text-sm transition-colors", state === "waiting" ? "text-neutral-400" : "font-medium text-ink")}>{label}</span>
      {state === "done" && <span className="ml-auto text-[10px] font-bold uppercase tracking-[0.1em] text-brand-dark">Done</span>}
    </motion.div>
  )
}
