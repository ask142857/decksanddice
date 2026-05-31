'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface SidebarProps {
  navItems: NavItem[]
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapse: () => void
  onMobileClose: () => void
}

export function Sidebar({ navItems, collapsed, mobileOpen, onToggleCollapse, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onMobileClose}
        aria-hidden="true"
        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
      />

      {/* Sidebar wrapper: fixed overlay on mobile, relative in-flow on desktop */}
      <div
        className={[
          'fixed top-[60px] left-0 z-50 h-[calc(100vh-60px)]',
          'md:relative md:top-auto md:h-full md:z-auto md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'transition-transform duration-300 ease-in-out',
        ].join(' ')}
        style={{ flexShrink: 0 }}
      >
        {/* Sidebar panel */}
        <aside
          className="h-full flex flex-col overflow-y-auto overflow-x-hidden transition-[width] duration-200"
          style={{
            width: collapsed ? '60px' : '220px',
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
          }}
        >
          <nav className="flex-1 flex flex-col gap-0.5 p-2 pt-3">
            {navItems.map((item) => {
              const bestMatch = navItems
                .filter(n => pathname === n.href || pathname.startsWith(n.href + '/'))
                .sort((a, b) => b.href.length - a.href.length)[0]
              const isActive = bestMatch?.href === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  className="btn-ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '8px' : '8px 12px',
                    color: isActive ? 'var(--accent)' : undefined,
                    background: isActive
                      ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                      : undefined,
                    fontWeight: isActive ? 500 : undefined,
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Desktop collapse/expand toggle button on border line */}
        <div className="hidden md:block">
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              position: 'absolute',
              right: -10,
              top: 20,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'border-color 0.15s ease, color 0.15s ease',
              zIndex: 1,
              padding: 0,
            }}
          >
            {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </div>
      </div>
    </>
  )
}
