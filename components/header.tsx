'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useEffect, useState, useMemo } from 'react'
import { Menu } from 'lucide-react'

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'App'

interface HeaderProps {
  onMobileMenuOpen?: () => void
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))
    const observer = new MutationObserver(() =>
      setIsLight(document.documentElement.classList.contains('light'))
    )
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (isLight) {
      html.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }

  const userButtonAppearance = useMemo(() => ({
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: isLight ? '#ffffff' : '#1a1a26',
      colorText: isLight ? '#0f0f1a' : '#f0f0ff',
      colorTextSecondary: isLight ? '#555570' : '#aaaacc',
      colorInputBackground: isLight ? '#f8f8fc' : '#0a0a0f',
      colorInputText: isLight ? '#0f0f1a' : '#f0f0ff',
      colorNeutral: isLight ? '#a0a0b8' : '#4a4a6a',
      borderRadius: '12px',
      fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
    },
    elements: {
      userButtonPopoverCard: {
        border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        padding: '8px',
      },
      userButtonPopoverActionButton: {
        borderRadius: '8px',
        color: isLight ? '#0f0f1a' : '#f0f0ff',
        padding: '10px 12px',
      },
      userButtonPopoverActionButtonIcon: {
        color: isLight ? '#555570' : '#aaaacc',
      },
      userButtonPopoverActionButtonText: {
        color: isLight ? '#0f0f1a' : '#f0f0ff',
        fontSize: '14px',
      },
      userButtonPopoverFooter: { display: 'none' },
    },
    layout: { unsafe_disableDevelopmentModeWarnings: true },
  }), [isLight])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--background) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left side: hamburger (mobile only) + app name (always) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Hamburger — mobile only, no inline display so md:hidden works */}
          {onMobileMenuOpen && (
            <div className="flex md:hidden">
              <button
                onClick={onMobileMenuOpen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Open navigation menu"
              >
                <Menu size={18} />
              </button>
            </div>
          )}
          <Link
            href="/"
            style={{
              fontWeight: 600,
              fontSize: '15px',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            {appName}
          </Link>
        </div>

        {/* Right side: theme toggle + auth — always visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: '8px', fontSize: '16px', lineHeight: 1 }}
            aria-label="Toggle theme"
          >
            {isLight ? '🌙' : '☀️'}
          </button>

          <SignedOut>
            <Link href="/sign-in" className="btn-ghost">
              Sign in
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={userButtonAppearance} />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
