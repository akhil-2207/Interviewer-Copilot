import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RouteErrorBoundaryProps {
  children: ReactNode
}

interface RouteErrorBoundaryState {
  failed: boolean
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Page rendering failed", {
      message: error.message,
      componentStack: info.componentStack,
    })
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 text-center shadow-float sm:p-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-soft text-warning">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em] text-ink">This page couldn’t be displayed.</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Your source documents are safe. Reload the page, or return to the guide form and try again.</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={() => window.location.reload()}><RefreshCcw className="h-4 w-4" /> Reload page</Button>
            <Button variant="brand" onClick={() => { window.location.href = "/generate" }}>Return to guide form</Button>
          </div>
        </div>
      </div>
    )
  }
}
