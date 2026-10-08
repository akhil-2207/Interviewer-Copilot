import { Sparkles } from "lucide-react"

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-brand">
        <span className="absolute inset-[5px] rounded-lg border border-white/10" />
        <Sparkles className="relative h-[19px] w-[19px]" strokeWidth={2.2} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-[-0.02em] text-ink">Interviewer</p>
          <p className="text-sm font-bold tracking-[-0.02em] text-ink">Copilot<span className="text-brand-dark">.</span></p>
        </div>
      )}
    </div>
  )
}
