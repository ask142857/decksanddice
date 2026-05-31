'use client'

import { useEffect, useRef } from 'react'
import { useSession } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { showToast } from '@/lib/toast'

export default function OnboardClient() {
  const { session } = useSession()
  const sessionRef = useRef(session)
  sessionRef.current = session
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function run() {
      try {
        const res = await fetch('/api/bootstrap', { method: 'POST' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          showToast.error((data as { error?: string }).error ?? 'Setup failed. Please try again.')
          return
        }
        // Reload session to pick up any new claims before navigating
        await sessionRef.current?.reload()
        window.location.href = '/dashboard'
      } catch {
        showToast.error('Setup failed. Please try again.')
      }
    }

    run()
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <Loader2
        size={40}
        style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }}
      />
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
        Setting up your account…
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
