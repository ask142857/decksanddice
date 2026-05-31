'use client'

import { GameLeaderboardEntry } from '@/types'
import { Trophy } from 'lucide-react'
import Image from 'next/image'

interface GameLeaderboardListProps {
  gameLeaderboards: Record<string, GameLeaderboardEntry[]>
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold">
        🥇
      </span>
    )
  if (rank === 2)
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-400/20 text-zinc-300 text-xs font-bold">
        🥈
      </span>
    )
  if (rank === 3)
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700/20 text-amber-600 text-xs font-bold">
        🥉
      </span>
    )
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--text-tertiary)] text-xs font-semibold">
      {rank}
    </span>
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
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Card Header */}
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-[var(--accent)]" />
        <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">
          {gameName}
        </h3>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <p className="text-[var(--text-tertiary)] text-sm text-center py-4">
          No wins recorded yet
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {entries.map((entry, idx) => (
            <li
              key={entry.user_id}
              className="flex items-center gap-3"
            >
              <RankBadge rank={idx + 1} />

              {/* Avatar */}
              <div className="relative h-7 w-7 flex-shrink-0 rounded-full overflow-hidden bg-[var(--surface-raised)]">
                {entry.avatar_url ? (
                  <Image
                    src={entry.avatar_url}
                    alt={entry.display_name}
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-[var(--text-secondary)]">
                    {entry.display_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name */}
              <span className="flex-1 text-sm text-[var(--text-primary)] truncate">
                {entry.display_name}
              </span>

              {/* Win count */}
              <span className="text-sm font-semibold text-[var(--accent)] tabular-nums">
                {entry.total_wins}W
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function GameLeaderboardList({
  gameLeaderboards,
}: GameLeaderboardListProps) {
  const gameNames = Object.keys(gameLeaderboards)

  if (gameNames.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[var(--text-tertiary)]">
          No game leaderboard data available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {gameNames.map((gameName) => (
        <GameLeaderboardCard
          key={gameName}
          gameName={gameName}
          entries={gameLeaderboards[gameName]}
        />
      ))}
    </div>
  )
}
