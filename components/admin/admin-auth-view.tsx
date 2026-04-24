"use client";

import { AuthUIProvider, AuthView } from "@daveyplate/better-auth-ui";

import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";

export function AdminAuthView() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-(--cursor-shadow-ambient) md:p-6">
      <AuthUIProvider
        authClient={authClient}
        basePath={ROUTES.adminLogin}
        redirectTo={ROUTES.adminDashboard}
        credentials={{ forgotPassword: false }}
        signUp={false}
        viewPaths={{ SIGN_IN: ROUTES.adminLogin }}
      >
        <AuthView view="SIGN_IN" redirectTo={ROUTES.adminDashboard} />
      </AuthUIProvider>
    </div>
  )
}
