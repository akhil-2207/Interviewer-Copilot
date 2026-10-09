import {
  LayoutDashboard,
  Sparkles,
  UserRound,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { NavLink, useLocation } from "react-router-dom"
import { Logo } from "./Logo"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Candidate", icon: UserRound, to: "/candidates/akhil-mathew" },
  { label: "Generate Guide", icon: Sparkles, to: "/generate" },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center justify-between px-6">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="focus-ring rounded-lg p-2 text-muted hover:bg-subtle" aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 pt-3" aria-label="Main navigation">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Workspace</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isSelected = item.to === "/"
            ? pathname === "/"
            : item.to.startsWith("/candidates")
              ? pathname.startsWith("/candidates")
              : pathname === "/generate" || pathname === "/guide"
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={() => cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isSelected ? "bg-subtle text-ink" : "text-muted hover:bg-subtle/70 hover:text-ink",
              )}
            >
              {() => (
                <>
                  {isSelected && (
                    <motion.span layoutId="sidebar-active" className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-brand-dark" />
                  )}
                  <Icon className={cn("h-[18px] w-[18px]", isSelected ? "text-brand-dark" : "text-neutral-400 group-hover:text-secondary")} strokeWidth={1.9} />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}

      </nav>
    </div>
  )
}

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] border-r border-line bg-white lg:block">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] lg:hidden"
              aria-label="Close navigation overlay"
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[250px] border-r border-line bg-white lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
