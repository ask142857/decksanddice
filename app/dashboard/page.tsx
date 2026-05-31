import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/service'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import type { Database } from '@/types/database'

type WinRow = Database['public']['Tables']['wins']['Row']
type GameRow = Database['public']['Tables']['games']['Row']
type GameImageRow = Database['public']['Tables']['game_images']['Row']

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

interface DashboardData {
  displayName: string
  totalWins: number
  gamesPlayed: number
  recentWins: RecentWin[]
}

async function getDashboardData(clerkUserId: string): Promise<DashboardData | null> {
  try {
    const { data: userRow, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, display_name')
      .eq('clerk_user_id', clerkUserId)
      .single()

    if (userError || !userRow) {
      console.error('[app/dashboard/page]', userError)
      return null
    }

    const user = userRow as Pick<Database['public']['Tables']['users']['Row'], 'id' | 'display_name'>

    // COUNT total wins via aggregate — avoids loading all rows
    const { count: totalWinsCount, error: totalError } = await supabaseAdmin
      .from('wins')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (totalError) {
      console.error('[app/dashboard/page] total wins count', totalError)
    }

    const totalWins = totalWinsCount ?? 0

    // Fetch distinct game_ids to count unique games played
    const { data: distinctGamesRaw, error: distinctError } = await supabaseAdmin
      .from('wins')
      .select('game_id')
      .eq('user_id', user.id)

    if (distinctError) {
      console.error('[app/dashboard/page] distinct games', distinctError)
    }

    const distinctWins = (distinctGamesRaw ?? []) as Pick<WinRow, 'game_id'>[]
    const gamesPlayed = new Set(distinctWins.map((w) => w.game_id)).size

    // Fetch 5 most recent wins
    const { data: recentRaw, error: recentError } = await supabaseAdmin
      .from('wins')
      .select('id, game_id, played_at, opponents')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(5)

    if (recentError) {
      console.error('[app/dashboard/page] recent wins', recentError)
    }

    const recentWinRows = (recentRaw ?? []) as Pick<WinRow, 'id' | 'game_id' | 'played_at' | 'opponents'>[]

    let recentWins: RecentWin[] = []

    if (recentWinRows.length > 0) {
      const gameIds = [...new Set(recentWinRows.map((w) => w.game_id))]

      const { data: gamesRaw, error: gamesError } = await supabaseAdmin
        .from('games')
        .select('id, name, slug')
        .in('id', gameIds)

      if (gamesError) {
        console.error('[app/dashboard/page] games lookup', gamesError)
      }

      const gamesMap = new Map<string, { name: string; slug: string }>()
      for (const g of (gamesRaw ?? []) as Pick<GameRow, 'id' | 'name' | 'slug'>[]) {
        gamesMap.set(g.id, { name: g.name, slug: g.slug })
      }

      const { data: coverImagesRaw, error: coverError } = await supabaseAdmin
        .from('game_images')
        .select('game_id, url, alt_text')
        .in('game_id', gameIds)
        .eq('is_cover', true)

      if (coverError) {
        console.error('[app/dashboard/page] cover images', coverError)
      }

      const coverMap = new Map<string, { url: string; alt_text: string }>()
      for (const img of (coverImagesRaw ?? []) as Pick<GameImageRow, 'game_id' | 'url' | 'alt_text'>[]) {
        coverMap.set(img.game_id, { url: img.url, alt_text: img.alt_text })
      }

      recentWins = recentWinRows.map((win) => {
        const game = gamesMap.get(win.game_id)
        const cover = coverMap.get(win.game_id) ?? null
        return {
          id: win.id,
          game_id: win.game_id,
          game_name: game?.name ?? 'Unknown Game',
          game_slug: game?.slug ?? '',
          cover_image_url: cover?.url ?? null,
          cover_image_alt: cover?.alt_text ?? null,
          played_at: win.played_at,
          opponents: win.opponents,
        }
      })
    }

    return {
      displayName: user.display_name,
      totalWins,
      gamesPlayed,
      recentWins,
    }
  } catch (err) {
    console.error('[app/dashboard/page]', err)
    return null
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const data = await getDashboardData(userId)

  return (
    <DashboardOverview
      displayName={data?.displayName ?? 'there'}
      totalWins={data?.totalWins ?? 0}
      gamesPlayed={data?.gamesPlayed ?? 0}
      recentWins={data?.recentWins ?? []}
    />
  )
}
