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
    <div className="grid grid-cols-1 rounded-lg border md:grid-cols-[220px_1fr]">
      <aside className="border-r p-4">
        <h2 className="mb-4 text-lg font-semibold">Admin</h2>
        <AdminNav role={session.user.role as string | undefined} />
        <div className="mt-6">
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
