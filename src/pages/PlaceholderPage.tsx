import { ArrowRight, Construction } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function PlaceholderPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-subtle text-secondary"><Construction className="h-5 w-5" /></div>
        <h2 className="mt-5 text-xl font-bold text-ink">This workspace is coming next</h2>
        <p className="mt-2 text-sm leading-6 text-muted">The hackathon demo focuses on the preparation flow from today’s dashboard to a personalised interview guide.</p>
        <Button variant="brand" className="mt-5" onClick={() => navigate("/")}>Return to demo <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </div>
  )
}
