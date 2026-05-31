'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import type { GameLeaderboardEntry } from '@/types/index'
import { GameLeaderboardList } from '@/components/leaderboard/GameLeaderboardList'

interface LeaderboardEntry {
  user_id: string
  display_name: string
  avatar_url: string | null
  total_wins: number
}

interface GlobalLeaderboardProps {
  entries: LeaderboardEntry[]
  gameLeaderboards?: Record<string, GameLeaderboardEntry[]>
}

const MEDAL_COLORS = [
  { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.35)', icon: '#fbbf24', label: 'gold' },
  { bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.35)', icon: '#9ca3af', label: 'silver' },
  { bg: 'rgba(180, 83, 9, 0.15)', border: 'rgba(180, 83, 9, 0.35)', icon: '#b45309', label: 'bronze' },
]

function getInitials(name: string): string {
  if (!name?.trim()) return '?'
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function Avatar({
  avatarUrl,
  displayName,
  size = 40,
}: {
  avatarUrl: string | null
  displayName: string
  size?: number
}) {
  const [imgFailed, setImgFailed] = useState(false)

  if (avatarUrl && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 600,
        color: 'white',
        flexShrink: 0,
      }}
      aria-label={displayName}
    >
      {getInitials(displayName)}
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const medal = MEDAL_COLORS[rank - 1]
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: medal.bg,
          border: `1px solid ${medal.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-label={`${medal.label} medal`}
      >
        <Trophy size={16} color={medal.icon} />
      </div>
    )
  }

  return (
    <div
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          minWidth: 24,
          textAlign: 'center',
        }}
      >
        {rank}
      </span>
    </div>
  )
}

export function GlobalLeaderboard({ entries, gameLeaderboards }: GlobalLeaderboardProps) {
  const [activeView, setActiveView] = useState<'global' | 'by-game'>('global')

  return (
    <div className="animate-fade-in">
      {/* Toggle control */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}
        role="group"
        aria-label="Leaderboard view"
      >
        <button
          onClick={() => setActiveView('global')}
          aria-pressed={activeView === 'global'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '12px 20px',
            minHeight: 44,
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border: activeView === 'global'
              ? '1px solid var(--accent)'
              : '1px solid var(--border)',
            background: activeView === 'global'
              ? 'var(--accent)'
              : 'rgba(255,255,255,0.03)',
            color: activeView === 'global'
              ? '#ffffff'
              : 'var(--text-secondary)',
            backdropFilter: activeView === 'global' ? 'none' : 'blur(12px)',
            WebkitBackdropFilter: activeView === 'global' ? 'none' : 'blur(12px)',
            boxShadow: activeView === 'global'
              ? '0 4px 12px var(--accent-glow)'
              : 'none',
            minWidth: 120,
            whiteSpace: 'nowrap',
          }}
        >
          <Trophy size={14} />
          Global Wins
        </button>

        <button
          onClick={() => setActiveView('by-game')}
          aria-pressed={activeView === 'by-game'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '12px 20px',
            minHeight: 44,
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border: activeView === 'by-game'
              ? '1px solid var(--accent)'
              : '1px solid var(--border)',
            background: activeView === 'by-game'
              ? 'var(--accent)'
              : 'rgba(255,255,255,0.03)',
            color: activeView === 'by-game'
              ? '#ffffff'
              : 'var(--text-secondary)',
            backdropFilter: activeView === 'by-game' ? 'none' : 'blur(12px)',
            WebkitBackdropFilter: activeView === 'by-game' ? 'none' : 'blur(12px)',
            boxShadow: activeView === 'by-game'
              ? '0 4px 12px var(--accent-glow)'
              : 'none',
            minWidth: 120,
            whiteSpace: 'nowrap',
          }}
        >
          <Trophy size={14} />
          By Game
        </button>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Leaderboard
        </h1>
        <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
          See who gets on top of the leaderboard
        </p>
        <span
          className="badge badge-warning"
          style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
        >
          <Trophy size={12} />
          Self-reported wins
        </span>
      </div>

      {/* By-game view */}
      {activeView === 'by-game' && gameLeaderboards && (
        <GameLeaderboardList gameLeaderboards={gameLeaderboards} />
      )}

      {/* By-game view — no data fallback */}
      {activeView === 'by-game' && !gameLeaderboards && (
        <div
          className="glass-card"
          style={{ padding: '48px 24px', textAlign: 'center' }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            No game data available yet.
          </p>
        </div>
      )}

      {/* Global view */}
      {activeView === 'global' && (
        <>
          {/* Empty state */}
          {entries.length === 0 && (
            <div
              className="glass-card"
              style={{
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                No wins logged yet — be the first!
              </h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Play a game at Decks &amp; Dice, then log your win to claim the top spot.
              </p>
              <Link href="/sign-up" className="btn-primary">
                Create Account &amp; Log a Win
              </Link>
            </div>
          )}

          {/* Leaderboard list */}
          {entries.length > 0 && (
            <div
              className="glass-card"
              style={{ overflow: 'hidden', padding: 0 }}
            >
              {entries.map((entry, index) => {
                const rank = index + 1
                const isTop3 = rank <= 3
                const medal = isTop3 ? MEDAL_COLORS[rank - 1] : null

                return (
                  <div
                    key={entry.user_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '14px 20px',
                      borderBottom:
                        index < entries.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                      background: isTop3 ? medal!.bg : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <RankBadge rank={rank} />

                    <Avatar
                      avatarUrl={entry.avatar_url}
                      displayName={entry.display_name}
                      size={38}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="font-medium"
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: 15,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {entry.display_name}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <Trophy
                        size={14}
                        color={isTop3 ? medal!.icon : 'var(--text-tertiary)'}
                      />
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: 15,
                          color: isTop3 ? medal!.icon : 'var(--text-primary)',
                        }}
                      >
                        {entry.total_wins}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {entry.total_wins === 1 ? 'win' : 'wins'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
