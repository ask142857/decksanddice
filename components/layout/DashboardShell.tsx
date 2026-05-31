'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard } from 'lucide-react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/layout/Sidebar'
import type { NavItem } from '@/components/layout/Sidebar'

// ← Code agent updates this map to add app-specific nav items per role.
// Always include a Dashboard/Home item first for each role.
// For single-role apps, only the "default" key is needed.
const navItemsByRole: Record<string, NavItem[]> = {
  default: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header onMobileMenuOpen={() => setMobileOpen(prev => !prev)} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar
          navItems={navItems}
          collapsed={isDesktop && collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapse={handleToggleCollapse}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main style={{ flex: 1, overflowY: 'auto', minWidth: 0, padding: '40px 24px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
