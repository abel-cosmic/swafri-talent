import { MainNav } from "@/components/layout/main-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { getMainNavRoutes } from "@/lib/routes/navigation"

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const mainRoutes = getMainNavRoutes()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="app-container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-display text-display-md">Swafri Talent</p>
            <p className="max-w-xl text-sm text-muted-foreground">
              Premium talent profiles and streamlined moderation in one warm, focused workspace.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 md:justify-end">
            <MainNav routes={mainRoutes} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="app-container flex-1 py-8 md:py-10">{children}</main>
    </div>
  )
}
