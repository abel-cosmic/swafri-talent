"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { getAdminNavRoutes } from "@/lib/routes/navigation"

function isRouteActive(pathname: string, routePath: string) {
  if (routePath === "/admin") {
    return pathname === "/admin" || pathname.startsWith("/admin/talents/")
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`)
}

export function AdminNav({ role }: { role?: string | null }) {
  const routes = getAdminNavRoutes(role)
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {routes.map((route) => {
        const active = isRouteActive(pathname, route.path)

        return (
          <Link
            key={route.key}
            href={route.path}
            aria-current={active ? "page" : undefined}
            className={cn(
              "font-display block rounded-lg border px-3 py-2 text-sm transition-colors",
              active
                ? "border-border bg-background text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-destructive",
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}
