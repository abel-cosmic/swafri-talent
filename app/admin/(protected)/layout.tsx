import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { AdminNav } from "@/components/admin/admin-nav";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(ROUTES.adminLogin);

  return (
    <div className="grid grid-cols-1 rounded-2xl border border-border/80 bg-card shadow-(--cursor-shadow-ambient) md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="border-b border-border/70 bg-muted/50 p-5 md:border-r md:border-b-0">
        <h2 className="mb-4 font-display text-display-md">Admin</h2>
        <AdminNav role={session.user.role as string | undefined} />
        <div className="mt-6">
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-5 md:p-7">{children}</main>
    </div>
  )
}
