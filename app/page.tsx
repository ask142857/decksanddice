import Link from 'next/link'

export default function Home() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Link href="/sign-in" className="btn-primary">
        Sign in
      </Link>
    </div>
  )
}
