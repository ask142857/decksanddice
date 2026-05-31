import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/service'
import { GameDetail } from '@/components/games/GameDetail'
import type { Database } from '@/types/database'

interface PageProps {
  params: Promise<{ slug: string }>
}

type GameRow = Database['public']['Tables']['games']['Row']
type GameImageRow = Database['public']['Tables']['game_images']['Row']
type LeaderboardByGameRow = Database['public']['Views']['leaderboard_by_game']['Row']

interface GameDetailData {
  game: Pick<GameRow, 'id' | 'slug' | 'name' | 'description' | 'how_to_play' | 'min_players' | 'max_players' | 'playtime_minutes' | 'difficulty'>
  images: Pick<GameImageRow, 'id' | 'url' | 'alt_text' | 'is_cover' | 'sort_order'>[]
  leaderboard: (Pick<LeaderboardByGameRow, 'user_id' | 'display_name' | 'avatar_url' | 'win_count'> & { rank: number })[]
}

async function getGameBySlug(slug: string): Promise<GameDetailData | null> {
  try {
    const { data: game, error: gameError } = await supabaseAdmin
      .from('games')
      .select('id, slug, name, description, how_to_play, min_players, max_players, playtime_minutes, difficulty')
      .eq('slug', slug)
      .single()

    if (gameError || !game) {
      return null
    }

    const typedGame = game as Pick<GameRow, 'id' | 'slug' | 'name' | 'description' | 'how_to_play' | 'min_players' | 'max_players' | 'playtime_minutes' | 'difficulty'>

    const { data: imagesRaw, error: imagesError } = await supabaseAdmin
      .from('game_images')
      .select('id, url, alt_text, is_cover, sort_order')
      .eq('game_id', typedGame.id)
      .order('sort_order', { ascending: true })

    if (imagesError) {
      console.error('[app/games/[slug]/page]', imagesError)
    }

    const images = (imagesRaw ?? []) as Pick<GameImageRow, 'id' | 'url' | 'alt_text' | 'is_cover' | 'sort_order'>[]

    // Query the leaderboard_by_game view which uses SQL GROUP BY — no full-table scan
    const { data: lbRaw, error: lbError } = await supabaseAdmin
      .from('leaderboard_by_game')
      .select('user_id, display_name, avatar_url, win_count')
      .eq('game_id', typedGame.id)
      .order('win_count', { ascending: false })
      .limit(5)

    if (lbError) {
      console.error('[app/games/[slug]/page] leaderboard', lbError)
    }

    const leaderboard = (lbRaw ?? []).map((row, index) => {
      const typedRow = row as Pick<LeaderboardByGameRow, 'user_id' | 'display_name' | 'avatar_url' | 'win_count'>
      return {
        user_id: typedRow.user_id,
        display_name: typedRow.display_name,
        avatar_url: typedRow.avatar_url,
        win_count: typedRow.win_count,
        rank: index + 1,
      }
    })

    return {
      game: typedGame,
      images,
      leaderboard,
    }
  } catch (err) {
    console.error('[app/games/[slug]/page]', err)
    return null
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getGameBySlug(slug)

  if (!data) {
    notFound()
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <GameDetail
          game={data.game}
          images={data.images}
          leaderboard={data.leaderboard}
        />
      </div>
    </main>
  )
}
