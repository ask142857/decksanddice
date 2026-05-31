'use client'

import { GameCard } from '@/components/games/GameCard'
import { GameSkeleton } from '@/components/games/GameSkeleton'

interface GameWithCover {
  id: string
  slug: string
  name: string
  description: string
  min_players: number
  max_players: number
  playtime_minutes: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  cover_image_url: string | null
  cover_image_alt: string | null
}

interface GameGridProps {
  games: GameWithCover[]
  isLoading?: boolean
}

const SKELETON_COUNT = 7

export function GameGrid({ games, isLoading = false }: GameGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <GameSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--surface-raised)' }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="17 2 12 7 7 2" />
          </svg>
        </div>
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          No games added yet
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Check back soon — our game library is coming!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
