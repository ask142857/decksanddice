import Link from 'next/link'

export function EmptyWinsState() {
  return (
    <div className="glass-card flex flex-col items-center justify-center text-center py-14 px-6">
      <div
        className="text-4xl mb-4"
        role="img"
        aria-label="game dice"
      >
        🎲
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        No wins yet — go play something!
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
        Play a game at Decks &amp; Dice, then come back to log your win!
      </p>
      <Link href="/games" className="btn-primary">
        Browse Games
      </Link>
    </div>
  )
}
