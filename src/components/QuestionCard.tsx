import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, Copy, Star } from "lucide-react"
import type { GuideQuestion, QuestionCategory } from "@shared/guide"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categoryTone: Record<QuestionCategory, "info" | "warning" | "success" | "neutral"> = {
  technical: "info",
  behavioural: "success",
  experience: "neutral",
  validation: "warning",
}

function categoryLabel(category: QuestionCategory) {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand("copy")
  textarea.remove()
  return copied
}

export function QuestionCard({ question, number, defaultOpen = false }: { question: GuideQuestion; number: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)
  const [mustAsk, setMustAsk] = useState(false)

  const copyQuestion = async (event: React.MouseEvent) => {
    event.stopPropagation()
    let copySucceeded = false
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable")
      await navigator.clipboard.writeText(question.question)
      copySucceeded = true
    } catch {
      copySucceeded = fallbackCopy(question.question)
    }

    if (copySucceeded) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } else {
      setCopied(false)
    }
  }

  return (
    <motion.article
      layout
      className={cn("overflow-hidden rounded-2xl border bg-white transition-colors", mustAsk ? "border-brand-dark/50" : "border-line hover:border-neutral-300")}
    >
      <button
        onClick={() => setOpen((value) => !value)}
        className="focus-ring w-full rounded-2xl p-5 text-left sm:p-6"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-bold text-muted sm:flex">{String(number).padStart(2, "0")}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={categoryTone[question.category]}>{categoryLabel(question.category)}</Badge>
              {mustAsk && <Badge variant="success"><Star className="h-3 w-3 fill-current" /> Must ask</Badge>}
            </div>
            <h3 className="mt-3 text-[15px] font-semibold leading-6 tracking-[-0.01em] text-ink sm:text-base sm:leading-7">{question.question}</h3>
            <p className="mt-2 text-xs text-muted"><span className="font-semibold text-secondary">Linked requirement:</span> {question.requirement}</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subtle text-muted">
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
          >
            <div className="mx-5 border-t border-line pb-5 pt-5 sm:mx-6 sm:pb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-subtle p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Candidate evidence</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">{question.candidateEvidence}</p>
                </div>
                <div className="rounded-xl bg-info-soft/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-info">Why ask this</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">{question.reason}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={copyQuestion}>
                  {copied ? <Check className="h-3.5 w-3.5 text-brand-dark" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy question"}
                </Button>
                <Button variant={mustAsk ? "soft" : "outline"} size="sm" onClick={() => setMustAsk((value) => !value)}>
                  <Star className={cn("h-3.5 w-3.5", mustAsk && "fill-current")} />
                  {mustAsk ? "Marked as must ask" : "Mark as must ask"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
