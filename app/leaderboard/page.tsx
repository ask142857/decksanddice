import { supabaseAdmin } from '@/lib/supabase/service'
import { GlobalLeaderboard } from '@/components/leaderboard/GlobalLeaderboard'
import type { GameLeaderboardEntry } from '@/types/index'

interface LeaderboardRow {
  user_id: string
  display_name: string
  avatar_url: string | null
  total_wins: number
}

interface GameRow {
  id: string
  name: string
}

interface LeaderboardByGameRow {
  game_id: string
  user_id: string
  display_name: string
  avatar_url: string | null
  win_count: number
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

async function getGameLeaderboards(): Promise<Record<string, GameLeaderboardEntry[]>> {
  try {
    // Fetch all games so we can guarantee all 7 are represented as keys
    const { data: gamesRaw, error: gamesError } = await supabaseAdmin
      .from('games')
      .select('id, name')
      .order('name', { ascending: true })

    if (gamesError) {
      console.error('[app/leaderboard/page] getGameLeaderboards games', gamesError)
      return {}
    }

    const games = (gamesRaw ?? []) as unknown as GameRow[]

    // Build the result map — all games start with empty arrays
    const result: Record<string, GameLeaderboardEntry[]> = {}
    for (const game of games) {
      result[game.id] = []
    }

    if (games.length === 0) {
      return result
    }

    // Query leaderboard_by_game view for all games at once
    const { data: lbRaw, error: lbError } = await supabaseAdmin
      .from('leaderboard_by_game')
      .select('game_id, user_id, display_name, avatar_url, win_count')
      .order('win_count', { ascending: false })

    if (lbError) {
      console.error('[app/leaderboard/page] getGameLeaderboards leaderboard_by_game', lbError)
      return result
    }

    const lbRows = (lbRaw ?? []) as unknown as LeaderboardByGameRow[]

    // Build a game name lookup map
    const gameNameMap = new Map<string, string>()
    for (const game of games) {
      gameNameMap.set(game.id, game.name)
    }

    // Group rows by game_id — leaderboard_by_game view already orders by win_count DESC
    // Within same win_count, apply display_name ASC as tiebreaker
    const grouped: Record<string, LeaderboardByGameRow[]> = {}
    for (const row of lbRows) {
      if (!grouped[row.game_id]) {
        grouped[row.game_id] = []
      }
      grouped[row.game_id].push(row)
    }

    // For each game, sort by win_count DESC then display_name ASC, then take top 5
    for (const gameId of Object.keys(result)) {
      const rows = grouped[gameId] ?? []
      const sorted = rows
        .slice()
        .sort((a, b) => {
          if (b.win_count !== a.win_count) return b.win_count - a.win_count
          return a.display_name.localeCompare(b.display_name)
        })
        .slice(0, 5)

      result[gameId] = sorted.map((row) => ({
        user_id: row.user_id,
        display_name: row.display_name,
        avatar_url: row.avatar_url,
        total_wins: row.win_count,
        game_id: row.game_id,
        game_name: gameNameMap.get(row.game_id) ?? 'Unknown Game',
      }))
    }

    return result
  } catch (err) {
    console.error('[app/leaderboard/page] getGameLeaderboards', err)
    return {}
  }
}

export default async function LeaderboardPage() {
  const [leaderboardData, gameLeaderboardData] = await Promise.all([
    getLeaderboard(),
    getGameLeaderboards(),
  ])

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GlobalLeaderboard
          entries={leaderboardData}
          gameLeaderboards={gameLeaderboardData}
        />
      </div>
    </main>
  )
}
