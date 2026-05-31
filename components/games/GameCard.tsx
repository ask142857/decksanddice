'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users } from 'lucide-react'

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

interface GameCardProps {
  game: GameWithCover
}

const DIFFICULTY_COLORS: Record<'Easy' | 'Medium' | 'Hard', string> = {
  Easy: 'badge-success',
  Medium: 'badge-warning',
  Hard: 'badge-error',
}

export function GameCard({ game }: GameCardProps) {
  const playerLabel =
    game.min_players === game.max_players
      ? `${game.min_players} player${game.min_players !== 1 ? 's' : ''}`
      : `${game.min_players}–${game.max_players} players`

  const playtimeLabel =
    game.playtime_minutes >= 60
      ? `${Math.round(game.playtime_minutes / 60)}h`
      : `${game.playtime_minutes}m`

  return (
    <article
      className="glass-card flex flex-col overflow-hidden group"
      style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
    >
      {/* Cover image */}
      <div className="relative w-full" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
        {game.cover_image_url ? (
          <Image
            src={game.cover_image_url}
            alt={game.cover_image_alt ?? game.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--surface-raised)' }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          </div>
        )}

        {/* Difficulty badge overlay */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${DIFFICULTY_COLORS[game.difficulty]}`}>
            {game.difficulty}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <h2
          className="text-lg font-semibold mb-2 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {game.name}
        </h2>

        <p
          className="text-sm mb-4 flex-1"
          style={{
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.6',
          }}
        >
          {game.description}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 badge badge-default">
            <Users size={11} />
            {playerLabel}
          </span>
          <span className="inline-flex items-center gap-1 badge badge-default">
            <Clock size={11} />
            {playtimeLabel}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/games/${game.slug}`}
          className="btn-primary w-full text-center"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
            boxShadow: '0 4px 15px var(--accent-glow)',
          }}
        >
          View Game
        </Link>
      </div>
    </article>
  )
}
