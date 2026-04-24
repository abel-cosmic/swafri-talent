import Link from "next/link";

import { getAdminNavRoutes } from "@/lib/routes/navigation";

export function AdminNav({ role }: { role?: string | null }) {
  const routes = getAdminNavRoutes(role);

  return (
    <nav className="space-y-2">
      {routes.map((route) => (
        <Link
          key={route.key}
          href={route.path}
          className="font-display block rounded-lg border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-destructive"
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
