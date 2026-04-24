import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getMainNavRoutes } from "@/lib/routes/navigation"

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const mainRoutes = getMainNavRoutes()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="space-y-1">
            <p className="font-display text-display-md">Swafri Talent</p>
            <p className="max-w-xl text-sm text-muted-foreground">
              Premium talent profiles and streamlined moderation in one warm, focused workspace.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {mainRoutes.map((route) => (
              <Button key={route.key} variant={route.path === "/" ? "default" : "ghost"} size="sm" asChild>
                <Link href={route.path}>{route.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 md:px-6 md:py-10">{children}</main>
    </div>
  )
}
