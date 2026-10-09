import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Header } from "./Header"
import { RouteErrorBoundary } from "./RouteErrorBoundary"
import { Sidebar } from "./Sidebar"

function pageMeta(pathname: string) {
  if (pathname === "/guide") return { title: "Interview Guide", subtitle: "Personalised questions and evidence generated from your sources" }
  if (pathname === "/generate") return { title: "Generate Guide", subtitle: "Turn resume evidence into better interview questions" }
  if (pathname.startsWith("/candidates/")) return { title: "Candidate Details", subtitle: "Submitted application and source documents" }
  return { title: "Dashboard", subtitle: "Candidates ready for interview preparation" }
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const meta = pageMeta(location.pathname)

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="lg:pl-[236px]">
        <Header {...meta} onMenu={() => setMobileOpen(true)} />
        <main>
          <RouteErrorBoundary key={location.pathname}>
            <Outlet />
          </RouteErrorBoundary>
        </main>
      </div>
    </div>
  )
}
