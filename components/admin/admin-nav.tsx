import Link from "next/link";

import { getAdminNavRoutes } from "@/lib/routes/navigation";

export function AdminNav({ role }: { role?: string | null }) {
  const routes = getAdminNavRoutes(role);

  return (
    <nav className="space-y-2">
      {routes.map((route) => (
        <Link key={route.key} href={route.path} className="block rounded px-3 py-2 hover:bg-muted">
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
