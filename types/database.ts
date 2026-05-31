export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          display_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          display_name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          display_name?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          how_to_play: string
          min_players: number
          max_players: number
          playtime_minutes: number
          difficulty: 'Easy' | 'Medium' | 'Hard'
          bgg_id: number | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description: string
          how_to_play: string
          min_players: number
          max_players: number
          playtime_minutes: number
          difficulty: 'Easy' | 'Medium' | 'Hard'
          bgg_id?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          how_to_play?: string
          min_players?: number
          max_players?: number
          playtime_minutes?: number
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          bgg_id?: number | null
          created_at?: string
        }
      }
      game_images: {
        Row: {
          id: string
          game_id: string
          url: string
          alt_text: string
          is_cover: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          url: string
          alt_text: string
          is_cover?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          url?: string
          alt_text?: string
          is_cover?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      wins: {
        Row: {
          id: string
          user_id: string
          game_id: string
          played_at: string
          opponents: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          played_at: string
          opponents?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          played_at?: string
          opponents?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      leaderboard_global: {
        Row: {
          user_id: string
          display_name: string
          avatar_url: string | null
          total_wins: number
        }
      }
      leaderboard_by_game: {
        Row: {
          game_id: string
          user_id: string
          display_name: string
          avatar_url: string | null
          win_count: number
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
