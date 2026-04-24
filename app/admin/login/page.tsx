import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/admin");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Admin Login</h1>
      <AdminLoginForm />
    </main>
  );
}
