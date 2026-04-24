import type { Metadata } from "next"

import "./globals.css"
import "@daveyplate/better-auth-ui/css"
import { AppShell } from "@/components/layout/app-shell"
import { AppProviders } from "@/components/providers/app-providers"

export const metadata: Metadata = {
  title: "Talent Management System",
  description: "Public talent profiles with admin moderation and RBAC.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="font-sans antialiased"
    >
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
