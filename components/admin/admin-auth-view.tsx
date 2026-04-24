"use client";

import { AuthUIProvider, AuthView } from "@daveyplate/better-auth-ui";

import { authClient } from "@/lib/auth-client";

export function AdminAuthView() {
  return (
    <AuthUIProvider
      authClient={authClient}
      basePath="/admin/login"
      redirectTo="/admin"
      credentials={{ forgotPassword: false }}
      signUp={false}
      viewPaths={{ SIGN_IN: "/admin/login" }}
    >
      <AuthView view="SIGN_IN" redirectTo="/admin" />
    </AuthUIProvider>
  );
}
