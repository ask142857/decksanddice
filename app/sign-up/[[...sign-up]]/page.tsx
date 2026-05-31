'use client'

import { SignUp } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const getClerkElements = (isLight: boolean) => ({
  card: { boxShadow: 'none', border: 'none', background: 'transparent', padding: '0' },
  rootBox: { width: '100%', overflow: 'visible' },
  cardBox: { width: '100%', boxShadow: 'none', overflow: 'visible' },
  header: { display: 'none' },
  main: { padding: '0' },
  footer: { padding: '0', background: 'transparent' },
  socialButtonsBlockButton: { border: `1px solid ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)'}`, background: isLight ? '#ffffff' : '#22222e' },
  socialButtonsBlockButtonText: { color: 'var(--text-primary)', fontWeight: 500 },
  formFieldInput: { border: `1px solid ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)'}`, color: 'var(--text-primary)' },
})

const darkVars = {
  colorPrimary: '#6366f1',
  colorBackground: '#0a0a0f',
  colorInputBackground: '#22222e',
  colorInputText: '#f0f0ff',
  colorText: '#f0f0ff',
  colorTextSecondary: '#8888aa',
  colorNeutral: '#2a2a3a',
  borderRadius: '12px',
  fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
}

const lightVars = {
  colorPrimary: '#6366f1',
  colorBackground: '#f8f8fc',
  colorInputBackground: '#ffffff',
  colorInputText: '#0f0f1a',
  colorText: '#0f0f1a',
  colorTextSecondary: '#555570',
  colorNeutral: '#a0a0b8',
  borderRadius: '12px',
  fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
}

export default function SignUpPage() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))
    const observer = new MutationObserver(() =>
      setIsLight(document.documentElement.classList.contains('light'))
    )
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        position: 'relative',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '40%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Glass card */}
      <div
        className="glass-card"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px', padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Get started for free — no credit card required
          </p>
        </div>

        <SignUp
          signInUrl="/sign-in"
          appearance={{
            variables: isLight ? lightVars : darkVars,
            elements: getClerkElements(isLight),
            layout: { unsafe_disableDevelopmentModeWarnings: true },
          }}
        />
      </div>
    </div>
  )
}
