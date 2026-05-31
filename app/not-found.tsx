import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'center',
        padding: '40px 16px',
      }}
    >
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        404
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: 0 }}>
        This page could not be found.
      </p>
      <Link href="/" className="btn-primary" style={{ marginTop: '8px' }}>
        Go home
      </Link>
    </div>
  )
}
