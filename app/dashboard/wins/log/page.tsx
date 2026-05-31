import { Suspense } from 'react'
import { supabaseAdmin } from '@/lib/supabase/service'
import { LogWinClient } from './LogWinClient'
import type { Game } from '@/types'

async function getGames(): Promise<Game[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any
  const { data, error } = await db
    .from('games')
    .select('id, slug, name, description, min_players, max_players, playtime_minutes, difficulty, how_to_play, bgg_id, created_at')
    .order('name', { ascending: true })

  if (error) {
    console.error('[dashboard/wins/log]', error)
    return []
  }

  return (data ?? []) as Game[]
}

export default async function LogWinPage() {
  const games = await getGames()

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="skeleton w-full max-w-lg h-96 rounded-xl" />
        </div>
      }
    >
      <LogWinClient games={games} />
    </Suspense>
  )
}
