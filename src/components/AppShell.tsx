import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Header } from "./Header"
import { RouteErrorBoundary } from "./RouteErrorBoundary"
import { Sidebar } from "./Sidebar"

function pageMeta(pathname: string) {
  if (pathname.includes("/guide")) return { title: "Interview Guide", subtitle: "Personalised questions and evidence for your interview" }
  if (pathname === "/generate") return { title: "Generate Guide", subtitle: "Turn resume evidence into better interview questions" }
  if (pathname.includes("akhil-mathew")) return { title: "Candidate Brief", subtitle: "Everything you need to prepare with confidence" }
  if (pathname === "/interviews") return { title: "Interviews", subtitle: "Manage your upcoming interview schedule" }
  if (pathname === "/candidates") return { title: "Candidates", subtitle: "Review candidates and preparation status" }
  if (pathname === "/settings") return { title: "Settings", subtitle: "Manage your interviewer workspace" }
  return { title: "Dashboard", subtitle: "Your interview preparation workspace" }
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
