import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { AdminNav } from "@/components/admin/admin-nav";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { auth } from "@/lib/auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
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
