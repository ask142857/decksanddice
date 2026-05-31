'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Trophy, PlusCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/layout/Sidebar'
import type { NavItem } from '@/components/layout/Sidebar'

const navItemsByRole: Record<string, NavItem[]> = {
  default: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Log a Win', href: '/dashboard/wins/log', icon: PlusCircle },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
  ],
}

function getNavItems(role: string | null): NavItem[] {
  if (!role) return navItemsByRole.default
  return navItemsByRole[role] ?? navItemsByRole.default
}

interface DashboardShellProps {
  children: React.ReactNode
  role: string | null
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const navItems = getNavItems(role)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('sidebar-collapsed') === 'true') setCollapsed(true)

    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleToggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header onMobileMenuOpen={() => setMobileOpen(prev => !prev)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          navItems={navItems}
          collapsed={isDesktop && collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapse={handleToggleCollapse}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-y-auto min-w-0 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
