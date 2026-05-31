import { supabaseAdmin } from '@/lib/supabase/service'
import { GameGrid } from '@/components/games/GameGrid'

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

async function getGamesWithCovers(): Promise<GameWithCover[]> {
  try {
    const { data: games, error: gamesError } = await supabaseAdmin
      .from('games')
      .select('id, slug, name, description, min_players, max_players, playtime_minutes, difficulty')
      .order('name', { ascending: true })

    if (gamesError || !games) {
      console.error('[app/games/page]', gamesError)
      return []
    }

    const gameIds = games.map((g) => g.id)

    const { data: coverImages, error: imagesError } = await supabaseAdmin
      .from('game_images')
      .select('game_id, url, alt_text')
      .in('game_id', gameIds)
      .eq('is_cover', true)

    if (imagesError) {
      console.error('[app/games/page]', imagesError)
    }

    const coverByGameId = new Map<string, { url: string; alt_text: string }>()
    if (coverImages) {
      for (const img of coverImages) {
        coverByGameId.set(img.game_id, { url: img.url, alt_text: img.alt_text })
      }
    }

    return games.map((game) => {
      const cover = coverByGameId.get(game.id) ?? null
      return {
        id: game.id,
        slug: game.slug,
        name: game.name,
        description: game.description,
        min_players: game.min_players,
        max_players: game.max_players,
        playtime_minutes: game.playtime_minutes,
        difficulty: game.difficulty as 'Easy' | 'Medium' | 'Hard',
        cover_image_url: cover?.url ?? null,
        cover_image_alt: cover?.alt_text ?? null,
      }
    })
  } catch (err) {
    console.error('[app/games/page]', err)
    return []
  }
}

export default async function GamesPage() {
  const games = await getGamesWithCovers()

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Our Game Library
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Browse our collection of board games available at Decks &amp; Dice.
          </p>
        </div>
        <GameGrid games={games} />
      </div>
    </main>
  )
}
