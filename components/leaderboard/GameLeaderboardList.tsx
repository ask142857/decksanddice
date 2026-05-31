'use client'

import { useState } from 'react'
import { Trophy } from 'lucide-react'
import type { GameLeaderboardEntry } from '@/types/index'

interface GameLeaderboardListProps {
  gameLeaderboards: Record<string, GameLeaderboardEntry[]>
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
  size = 32,
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
          width: 28,
          height: 28,
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
        <Trophy size={12} color={medal.icon} />
      </div>
    )
  }

  return (
    <div
      style={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          minWidth: 20,
          textAlign: 'center',
        }}
      >
        {rank}
      </span>
    </div>
  )
}

function GameLeaderboardCard({
  gameName,
  entries,
}: {
  gameName: string
  entries: GameLeaderboardEntry[]
}) {
  return (
    <div className="glass-card overflow-hidden" style={{ padding: 0 }}>
      {/* Card heading */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <h3
          className="font-semibold"
          style={{
            color: 'var(--text-primary)',
            fontSize: 15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {gameName}
        </h3>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
            No wins logged yet
          </p>
        </div>
      )}

      {/* Winner rows */}
      {entries.length > 0 && (
        <div>
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
                  gap: 10,
                  padding: '10px 16px',
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
                  size={28}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="font-medium"
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: 13,
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
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <Trophy
                    size={11}
                    color={isTop3 ? medal!.icon : 'var(--text-tertiary)'}
                  />
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: 13,
                      color: isTop3 ? medal!.icon : 'var(--text-primary)',
                    }}
                  >
                    {entry.total_wins}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function GameLeaderboardList({ gameLeaderboards }: GameLeaderboardListProps) {
  const gameIds = Object.keys(gameLeaderboards)

  if (gameIds.length === 0) {
    return (
      <div
        className="glass-card"
        style={{ padding: '48px 24px', textAlign: 'center' }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          No game data available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gameIds.map((gameId) => {
        const entries = gameLeaderboards[gameId] ?? []
        const gameName = entries[0]?.game_name ?? 'Unknown Game'

        return (
          <GameLeaderboardCard
            key={gameId}
            gameName={gameName}
            entries={entries}
          />
        )
      })}
    </div>
  )
}
