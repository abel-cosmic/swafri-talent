import { Geist_Mono, Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import "@daveyplate/better-auth-ui/css"
import { AppShell } from "@/components/layout/app-shell"
import { AppProviders } from "@/components/providers/app-providers"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Talent Management System",
  description: "Public talent profiles with admin moderation and RBAC.",
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
