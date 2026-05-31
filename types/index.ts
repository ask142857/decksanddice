export interface Game {
  id: string
  slug: string
  name: string
  description: string
  min_players: number
  max_players: number
  playtime_minutes: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  how_to_play: string
  bgg_id: number | null
  created_at: string
}

export interface GameImage {
  id: string
  game_id: string
  url: string
  alt_text: string
  is_cover: boolean
  sort_order: number
  created_at: string
}

export interface Win {
  id: string
  user_id: string
  game_id: string
  played_at: string
  opponents: string | null
  created_at: string
}

export interface User {
  id: string
  clerk_user_id: string
  display_name: string
  email: string
  avatar_url: string | null
  created_at: string
}

export interface LeaderboardEntry {
  user_id: string
  display_name: string
  avatar_url: string | null
  total_wins: number
}

export interface GameLeaderboardEntry {
  user_id: string
  display_name: string
  avatar_url: string | null
  win_count: number
}

export interface WinFormValues {
  game_id: string
  played_at: string
  opponents: string
}
