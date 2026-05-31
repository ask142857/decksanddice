"use client"

import { useState } from 'react'
import { LayoutDashboard, PlusCircle, Trophy } from 'lucide-react'
import { Sidebar, NavItem } from '@/components/layout/Sidebar'
import { Header } from '@/components/header'

interface DashboardShellProps {
  children: React.ReactNode
  role: string | null
}

const navItemsByRole: Record<string, NavItem[]> = {
  default: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Log a Win', href: '/dashboard/wins/log', icon: PlusCircle },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ],
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = navItemsByRole[role ?? 'default'] ?? navItemsByRole['default']

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <Sidebar
        navItems={navItems}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
