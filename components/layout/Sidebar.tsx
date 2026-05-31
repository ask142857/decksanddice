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

const borderBtnStyle: React.CSSProperties = {
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
}

export function Sidebar({ navItems, collapsed, mobileOpen, onToggleCollapse, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop — full screen, header stays above via z-50 */}
      <div
        onClick={onMobileClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 40,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        className="md:hidden"
      />

      {/* Wrapper: fixed overlay on mobile, relative in-flow on desktop */}
      <div
        style={{ flexShrink: 0 }}
        className={[
          'fixed top-[60px] left-0 z-50 h-[calc(100vh-60px)]',
          'md:relative md:top-auto md:h-full md:z-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          'transition-transform duration-300 ease-in-out',
        ].join(' ')}
      >
        {/* Sidebar panel */}
        <aside
          style={{
            width: collapsed ? '60px' : '220px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'width 0.2s ease',
          }}
        >
          <nav style={{ flex: 1, padding: '8px', paddingTop: '13.5px', paddingRight: '15px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Desktop: collapse/expand button on border line */}
        <div className="hidden md:block">
          <button
            onClick={onToggleCollapse}
            style={borderBtnStyle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </div>

      </div>
    </>
  )
}
