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
      className="sticky top-0 z-50 h-[60px] flex items-center"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--background) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="w-full px-4 flex items-center justify-between">
        {/* Left: hamburger (mobile only) + app name */}
        <div className="flex items-center gap-1">
          {onMobileMenuOpen && (
            <div className="flex md:hidden">
              <button
                onClick={onMobileMenuOpen}
                className="flex items-center justify-center p-2 rounded-xl bg-transparent border-none cursor-pointer transition-all duration-200"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Open navigation menu"
              >
                <Menu size={18} />
              </button>
            </div>
          )}
          <Link
            href="/"
            className="font-semibold text-[15px] no-underline tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {appName}
          </Link>
        </div>

        {/* Right: theme toggle + auth */}
        <div className="flex items-center gap-2 ml-auto">
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
