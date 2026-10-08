import {
  CalendarRange,
  LayoutDashboard,
  Settings,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { NavLink } from "react-router-dom"
import { Logo } from "./Logo"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Interviews", icon: CalendarRange, to: "/interviews" },
  { label: "Candidates", icon: UsersRound, to: "/candidates" },
  { label: "Generate Guide", icon: Sparkles, to: "/candidates/akhil-mathew" },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
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
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) => cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-subtle text-ink" : "text-muted hover:bg-subtle/70 hover:text-ink",
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span layoutId="sidebar-active" className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-brand-dark" />
                  )}
                  <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-brand-dark" : "text-neutral-400 group-hover:text-secondary")} strokeWidth={1.9} />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}

        <div className="my-4 border-t border-line" />
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) => cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive ? "bg-subtle text-ink" : "text-muted hover:bg-subtle/70 hover:text-ink",
          )}
        >
          <Settings className="h-[18px] w-[18px] text-neutral-400" strokeWidth={1.9} />
          Settings
        </NavLink>
      </nav>

      <div className="p-4">
        <div className="rounded-2xl border border-line bg-subtle/70 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">SW</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">Sarah Wilson</p>
              <p className="truncate text-xs text-muted">Senior Interviewer</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <span className="h-2 w-2 rounded-full bg-brand-dark" />
            <span className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted">Hackathon demo</span>
          </div>
        </div>
      </div>
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
