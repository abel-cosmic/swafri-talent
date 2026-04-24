"use client";

import { AuthUIProvider, AuthView } from "@daveyplate/better-auth-ui";

import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";

export function AdminAuthView() {
  return (
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
  );
}
