import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ROUTES } from "@/lib/routes";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(ROUTES.adminDashboard);

  return (
    <PageWrapper
      title="Admin Login"
      description="Sign in to access moderation and user management tools."
    >
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-(--cursor-shadow-ambient) md:p-6">
        <AdminLoginForm />
      </div>
    </PageWrapper>
  )
}
