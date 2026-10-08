import { CircleCheck, Clock3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { InterviewStatus } from "@/data/mockData"

export function StatusBadge({ status }: { status: InterviewStatus }) {
  const ready = status === "Guide ready"
  return (
    <Badge variant={ready ? "success" : "warning"}>
      {ready ? <CircleCheck className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
      {status}
    </Badge>
  )
}
