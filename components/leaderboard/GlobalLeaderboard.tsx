'use client'

import { LeaderboardEntry, GameLeaderboardEntry } from '@/types'
import { Trophy } from 'lucide-react'
import Image from 'next/image'
import GameLeaderboardList from './GameLeaderboardList'

interface GlobalLeaderboardProps {
  leaderboardData: LeaderboardEntry[]
  gameLeaderboards?: Record<string, GameLeaderboardEntry[]>
}

function RankBadge({ rank }: { rank: number }) {
  const base =
    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'
  if (rank === 1)
    return (
      <span className={`${base} bg-yellow-400/20 text-yellow-400`}>🥇</span>
    )
  if (rank === 2)
    return (
      <span className={`${base} bg-zinc-400/20 text-zinc-300`}>🥈</span>
    )
  if (rank === 3)
    return (
      <span className={`${base} bg-amber-700/20 text-amber-600`}>🥉</span>
    )
  return (
    <span
      className={`${base} bg-[var(--surface-raised)] text-[var(--text-tertiary)]`}
    >
      {rank}
    </span>
  )
}

export default function GlobalLeaderboard({
  leaderboardData,
  gameLeaderboards,
}: GlobalLeaderboardProps) {
  return (
    <div className="space-y-10">
      {/* Global Rankings */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Global Rankings
          </h2>
        </div>

        {leaderboardData.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-[var(--text-tertiary)]">
              No wins logged yet — be the first!
            </p>
          </div>
        ) : (
          <div className="glass-card divide-y divide-[var(--border)]">
            {leaderboardData.map((entry, idx) => (
              <div
                key={entry.user_id}
                className="flex items-center gap-4 px-5 py-3"
              >
                <RankBadge rank={idx + 1} />

                <div className="relative h-9 w-9 flex-shrink-0 rounded-full overflow-hidden bg-[var(--surface-raised)]">
                  {entry.avatar_url ? (
                    <Image
                      src={entry.avatar_url}
                      alt={entry.display_name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-[var(--text-secondary)]">
                      {entry.display_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <span className="flex-1 text-sm font-medium text-[var(--text-primary)] truncate">
                  {entry.display_name}
                </span>

                <span className="text-sm font-bold text-[var(--accent)] tabular-nums">
                  {entry.total_wins}{' '}
                  <span className="font-normal text-[var(--text-tertiary)]">
                    wins
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Per-Game Leaderboards */}
      {gameLeaderboards && Object.keys(gameLeaderboards).length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              By Game
            </h2>
          </div>
          <GameLeaderboardList gameLeaderboards={gameLeaderboards} />
        </section>
      )}
    </div>
  )
}
