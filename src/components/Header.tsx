import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({ title, subtitle, onMenu }: { title: string; subtitle: string; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/90 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <Button onClick={onMenu} variant="outline" size="icon" className="shrink-0 lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-[-0.02em] text-ink sm:text-lg">{title}</h1>
            <p className="hidden truncate text-xs text-muted sm:block">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Search">
            <Search className="h-[18px] w-[18px]" />
          </Button>
          <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-white" />
          </Button>
          <div className="ml-1 hidden items-center gap-2 border-l border-line pl-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">SW</div>
          </div>
        </div>
      </div>
    </header>
  )
}
