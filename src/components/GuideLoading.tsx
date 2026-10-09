import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LoadingStep } from "@/components/LoadingStep"

const generationSteps = [
  "Reading candidate experience",
  "Understanding job requirements",
  "Matching evidence",
  "Identifying areas to validate",
  "Creating personalised questions",
]

export function GuideLoading({ candidateName = "the candidate" }: { candidateName?: string }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, generationSteps.length - 1))
    }, 700)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 shadow-float sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
          <motion.div animate={{ rotate: [0, 8, -4, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}><Sparkles className="h-7 w-7" /></motion.div>
        </div>
        <div className="mt-6 text-center">
          <Badge variant="success">Building from resume + role</Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-[-0.035em] text-ink">Creating {candidateName}’s interview guide</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Connecting candidate evidence to the role so you can ask sharper, more relevant questions.</p>
        </div>
        <div className="mt-7 space-y-1">
          {generationSteps.map((step, index) => <LoadingStep key={step} label={step} index={index} state={index < activeStep ? "done" : index === activeStep ? "active" : "waiting"} />)}
        </div>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-subtle"><motion.div className="h-full rounded-full bg-brand-dark" animate={{ width: `${((activeStep + 1) / generationSteps.length) * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }} /></div>
        <p className="mt-3 text-center text-[11px] text-muted">Gemini is grounding each question in the supplied evidence</p>
      </motion.div>
    </div>
  )
}
