import { auth } from '@clerk/nextjs/server'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role ?? null

  return <DashboardShell role={role}>{children}</DashboardShell>
}
