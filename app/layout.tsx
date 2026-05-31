import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}`,
  },
  description: 'Built with Next.js 15, Clerk, and Supabase.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
        <body className="antialiased">
          <QueryProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
