import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { AdminAuthView } from "@/components/admin/admin-auth-view";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ROUTES } from "@/lib/routes";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(ROUTES.adminDashboard);

  return (
    <PageWrapper title="Admin Login" className="max-w-md">
      <AdminAuthView />
    </PageWrapper>
  );
}
