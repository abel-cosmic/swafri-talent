import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getMainNavRoutes } from "@/lib/routes/navigation"

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const mainRoutes = getMainNavRoutes()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Swafri Talent</p>
            <p className="text-sm text-muted-foreground">Centralized navigation for public and admin routes</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {mainRoutes.map((route) => (
              <Button key={route.key} variant={route.path === "/" ? "default" : "outline"} size="sm" asChild>
                <Link href={route.path}>{route.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
