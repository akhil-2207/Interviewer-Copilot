import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

function pageMeta(pathname: string) {
  if (pathname.includes("/guide")) return { title: "Interview Guide", subtitle: "Personalised questions and evidence for your interview" }
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
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
