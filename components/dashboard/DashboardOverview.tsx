'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Gamepad2, CalendarDays, Users, PlusCircle } from 'lucide-react'
import { format } from 'date-fns'
import { EmptyWinsState } from '@/components/dashboard/EmptyWinsState'

interface RecentWin {
  id: string
  game_id: string
  game_name: string
  game_slug: string
  cover_image_url: string | null
  cover_image_alt: string | null
  played_at: string
  opponents: string | null
}

interface DashboardOverviewProps {
  displayName: string
  totalWins: number
  gamesPlayed: number
  recentWins: RecentWin[]
}

function formatPlayedAt(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function DashboardOverview({ displayName, totalWins, gamesPlayed, recentWins }: DashboardOverviewProps) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome back, {displayName}!
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Here&apos;s how you&apos;re doing at Decks &amp; Dice.
          </p>
        </div>
        <Link
          href="/dashboard/wins/log"
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <PlusCircle size={16} />
          Log a Win
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 flex items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-glow)' }}
          >
            <Trophy size={22} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>
              Total Wins
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalWins}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-glow)' }}
          >
            <Gamepad2 size={22} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>
              Games Played
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {gamesPlayed}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Wins */}
      <div>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Recent Wins
        </h2>

        {recentWins.length === 0 ? (
          <EmptyWinsState />
        ) : (
          <div className="glass-card divide-y" style={{ borderColor: 'var(--border)' }}>
            {recentWins.map((win) => (
              <div
                key={win.id}
                className="flex items-center gap-4 p-4"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* Cover thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {win.cover_image_url ? (
                    <Image
                      src={win.cover_image_url}
                      alt={win.cover_image_alt ?? win.game_name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      <Gamepad2 size={18} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  )}
                </div>

                {/* Game info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/games/${win.game_slug}`}
                    className="font-medium text-sm hover:underline truncate block"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {win.game_name}
                  </Link>
                  {win.opponents && (
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      <Users size={11} className="inline mr-1" />
                      vs {win.opponents}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div
                  className="flex items-center gap-1.5 text-xs flex-shrink-0"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <CalendarDays size={12} />
                  <span>{formatPlayedAt(win.played_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Browse games CTA — only when user has wins */}
      {recentWins.length > 0 && (
        <div className="flex justify-center pt-2">
          <Link
            href="/games"
            className="btn-ghost text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Browse all games
          </Link>
        </div>
      )}
    </div>
  )
}
