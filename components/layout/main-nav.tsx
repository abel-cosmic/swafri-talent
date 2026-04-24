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
          <Button key={route.key} variant={active ? "default" : "ghost"} size="sm" asChild>
            <Link href={route.path} aria-current={active ? "page" : undefined}>
              {route.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
