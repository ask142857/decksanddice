'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Clock, Zap, PlusCircle, Trophy, ChevronLeft } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import type { Database } from '@/types/database'

type GameRow = Database['public']['Tables']['games']['Row']
type GameImageRow = Database['public']['Tables']['game_images']['Row']
type LeaderboardByGameRow = Database['public']['Views']['leaderboard_by_game']['Row']

interface GameDetailProps {
  game: Pick<GameRow, 'id' | 'slug' | 'name' | 'description' | 'how_to_play' | 'min_players' | 'max_players' | 'playtime_minutes' | 'difficulty'>
  images: Pick<GameImageRow, 'id' | 'url' | 'alt_text' | 'is_cover' | 'sort_order'>[]
  leaderboard: (Pick<LeaderboardByGameRow, 'user_id' | 'display_name' | 'avatar_url' | 'win_count'> & { rank: number })[]
}

const DIFFICULTY_STYLES: Record<'Easy' | 'Medium' | 'Hard', { badge: string; label: string }> = {
  Easy: { badge: 'badge-success', label: 'Easy' },
  Medium: { badge: 'badge-warning', label: 'Medium' },
  Hard: { badge: 'badge-error', label: 'Hard' },
}

const RANK_MEDALS = ['🥇', '🥈', '🥉']

export function GameDetail({ game, images, leaderboard }: GameDetailProps) {
  const { userId } = useAuth()

  const coverImage = images.find((img) => img.is_cover) ?? images[0] ?? null
  const [activeImage, setActiveImage] = useState<Pick<GameImageRow, 'id' | 'url' | 'alt_text' | 'is_cover' | 'sort_order'> | null>(coverImage)

  const playerLabel =
    game.min_players === game.max_players
      ? `${game.min_players} player${game.min_players !== 1 ? 's' : ''}`
      : `${game.min_players}–${game.max_players} players`

  const playtimeLabel =
    game.playtime_minutes >= 60
      ? `${Math.round(game.playtime_minutes / 60)}h`
      : `${game.playtime_minutes}m`

  const paragraphs = game.how_to_play
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  const logWinHref = userId
    ? `/dashboard/wins/log?game_id=${game.id}`
    : '/sign-up'

  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/games"
          className="inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={16} />
          Back to Games
        </Link>
      </div>

      {/* Title */}
      <h1
        className="text-3xl sm:text-4xl font-bold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {game.name}
      </h1>
      <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
        {game.description}
      </p>

      {/* Image Gallery */}
      {images.length > 0 && (
        <section className="mb-8">
          {/* Main image */}
          <div
            className="relative w-full rounded-2xl overflow-hidden mb-3"
            style={{ aspectRatio: '16/9' }}
          >
            {activeImage ? (
              <Image
                src={activeImage.url}
                alt={activeImage.alt_text}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 900px"
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface-raised)' }}
              >
                <span style={{ color: 'var(--text-tertiary)' }}>No image</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img)}
                  aria-label={`View image: ${img.alt_text}`}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    width: '80px',
                    height: '56px',
                    border:
                      activeImage?.id === img.id
                        ? '2px solid var(--accent)'
                        : '2px solid var(--border)',
                    opacity: activeImage?.id === img.id ? 1 : 0.65,
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Stats Bar */}
      <section className="glass-card p-4 flex flex-wrap gap-4 mb-8">
        <div
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          <Users size={16} style={{ color: 'var(--accent)' }} />
          {playerLabel}
        </div>
        <div
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          <Clock size={16} style={{ color: 'var(--accent)' }} />
          {playtimeLabel}
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-medium">
          <Zap size={16} style={{ color: 'var(--accent)' }} />
          <span className={`badge ${DIFFICULTY_STYLES[game.difficulty].badge}`}>
            {DIFFICULTY_STYLES[game.difficulty].label}
          </span>
        </div>
      </section>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* How to Play — spans 2 cols on desktop */}
        <section className="lg:col-span-2">
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            How to Play
          </h2>
          <div className="glass-card p-6 space-y-4">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.7',
                  }}
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Rules coming soon — ask a staff member for help!
              </p>
            )}
          </div>
        </section>

        {/* Right column: Leaderboard + CTA */}
        <div className="flex flex-col gap-6">
          {/* Per-game mini leaderboard */}
          <section>
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              <span className="inline-flex items-center gap-2">
                <Trophy size={18} style={{ color: 'var(--accent)' }} />
                Top Players
              </span>
            </h2>
            <div className="glass-card overflow-hidden">
              {leaderboard.length === 0 ? (
                <div className="p-6 text-center">
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    No wins logged yet for this game — be the first!
                  </p>
                  {userId && (
                    <Link
                      href={`/dashboard/wins/log?game_id=${game.id}`}
                      className="text-sm font-medium"
                      style={{ color: 'var(--accent)' }}
                    >
                      Log a Win
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {leaderboard.map((entry) => (
                    <li
                      key={entry.user_id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span
                        className="text-base w-6 text-center flex-shrink-0"
                        aria-label={`Rank ${entry.rank}`}
                      >
                        {entry.rank <= 3 ? (
                          RANK_MEDALS[entry.rank - 1]
                        ) : (
                          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            {entry.rank}
                          </span>
                        )}
                      </span>
                      {entry.avatar_url ? (
                        <Image
                          src={entry.avatar_url}
                          alt={entry.display_name}
                          width={28}
                          height={28}
                          className="rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{
                            backgroundColor: 'var(--accent-glow)',
                            color: 'var(--accent)',
                          }}
                        >
                          {entry.display_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        className="flex-1 text-sm font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {entry.display_name}
                      </span>
                      <span
                        className="text-sm font-semibold flex-shrink-0"
                        style={{ color: 'var(--accent)' }}
                      >
                        {entry.win_count}W
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Log a Win CTA */}
          <Link
            href={logWinHref}
            className="btn-primary flex items-center justify-center gap-2 w-full text-center py-3"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              boxShadow: '0 4px 15px var(--accent-glow)',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            <PlusCircle size={18} />
            Log a Win for This Game
          </Link>
        </div>
      </div>
    </div>
  )
}
