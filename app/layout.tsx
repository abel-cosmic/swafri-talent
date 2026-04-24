import { Geist_Mono, Inter } from "next/font/google"
import type { Metadata } from "next"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"

import "./globals.css"
import "@daveyplate/better-auth-ui/css"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/components/providers/auth"

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
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider> {children} </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
