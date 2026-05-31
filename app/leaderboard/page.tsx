import { supabaseAdmin } from '@/lib/supabase/service'
import { GlobalLeaderboard } from '@/components/leaderboard/GlobalLeaderboard'

interface LeaderboardRow {
  user_id: string
  display_name: string
  avatar_url: string | null
  total_wins: number
}

async function getLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('leaderboard_global')
      .select('user_id, display_name, avatar_url, total_wins')
      .order('total_wins', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[app/leaderboard/page]', error)
      return []
    }

    const rows = (data ?? []) as unknown as LeaderboardRow[]
    return rows
  } catch (err) {
    console.error('[app/leaderboard/page]', err)
    return []
  }
}

export default async function LeaderboardPage() {
  const entries = await getLeaderboard()

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GlobalLeaderboard entries={entries} />
      </div>
    </main>
  )
}
