"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import type { AppRouteItem } from "@/lib/routes/navigation"

type MainNavProps = {
  routes: AppRouteItem[]
}

function isRouteActive(pathname: string, routePath: string) {
  if (routePath === "/") {
    return pathname === "/"
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`)
}

export function MainNav({ routes }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {routes.map((route) => {
        const active = isRouteActive(pathname, route.path)
        return (
          <Button
            key={route.key}
            variant="ghost"
            size="sm"
            className={
              active
                ? "rounded-full border border-border bg-muted text-foreground hover:bg-muted"
                : "rounded-full border border-transparent text-muted-foreground hover:border-border hover:bg-muted/70 hover:text-foreground"
            }
            asChild
          >
            <Link href={route.path} aria-current={active ? "page" : undefined}>
              {route.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
