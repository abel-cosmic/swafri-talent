import Link from "next/link"

import { PageWrapper } from "@/components/layout/page-wrapper"
import { Button } from "@/components/ui/button"
import { getRouteGroups, type RouteGroup } from "@/lib/routes/navigation"

const groupOrder: RouteGroup[] = ["public", "admin", "dynamic", "technical"]

const groupLabels: Record<RouteGroup, string> = {
  public: "Public Routes",
  admin: "Admin Routes",
  dynamic: "Dynamic Route Templates",
  technical: "Technical Routes",
}

export default function RoutesPage() {
  const groupedRoutes = getRouteGroups({ includeRestricted: true })

  return (
    <PageWrapper
      title="Project Route Viewer"
      description="Centralized route registry for public, admin, dynamic, and technical surfaces."
    >
      <div className="space-y-6">
        {groupOrder.map((groupKey) => {
          const routes = groupedRoutes[groupKey]
          if (!routes.length) {
            return null
          }

          return (
            <section key={groupKey} className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-(--cursor-shadow-ambient) md:p-5">
              <h2 className="font-display text-display-md">{groupLabels[groupKey]}</h2>
              <div className="grid gap-3">
                {routes.map((route) => {
                  const targetPath = route.examplePath ?? route.path

                  return (
                    <div key={route.key} className="rounded-xl border border-border/80 bg-muted/55 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-display text-base">{route.label}</p>
                          <p className="text-sm text-muted-foreground">{route.description ?? "No description"}</p>
                        </div>
                        <Button size="sm" variant="secondary" asChild>
                          <Link href={targetPath}>Open Route</Link>
                        </Button>
                      </div>
                      <p className="mt-2 text-sm">
                        <span className="font-medium">Template:</span> <code>{route.path}</code>
                      </p>
                      {route.examplePath ? (
                        <p className="text-sm">
                          <span className="font-medium">Example:</span> <code>{route.examplePath}</code>
                        </p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </PageWrapper>
  )
}
