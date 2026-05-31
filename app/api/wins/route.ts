import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/service'
import { WinLogSchema } from '@/lib/wins'

interface UserRow {
  id: string
}

interface WinRow {
  id: string
  user_id: string
  game_id: string
  played_at: string
  opponents: string | null
  created_at: string
}

interface CountRow {
  count: number
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You need to be signed in to log a win.' } },
        { status: 401 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any

    // Parse and validate request body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Request body must be valid JSON.' } },
        { status: 400 }
      )
    }

    const parsed = WinLogSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: firstError?.message ?? 'Invalid request data.' } },
        { status: 400 }
      )
    }

    const { game_id, played_at, opponents } = parsed.data

    // Validate played_at is not in the future and not more than 365 days in the past
    const playedDate = new Date(played_at)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    oneYearAgo.setHours(0, 0, 0, 0)

    if (playedDate > today) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'played_at cannot be in the future.' } },
        { status: 400 }
      )
    }

    if (playedDate < oneYearAgo) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'played_at cannot be more than 365 days in the past.' } },
        { status: 400 }
      )
    }

    // Look up the internal user UUID by clerk_user_id
    const { data: userRow, error: userError } = await db
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (userError || !userRow) {
      console.error('[api/wins]', userError)
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User account not found. Please try signing out and back in.' } },
        { status: 404 }
      )
    }

    const internalUser = userRow as UserRow

    // Verify game_id exists in the games table
    const { data: gameRow, error: gameError } = await db
      .from('games')
      .select('id')
      .eq('id', game_id)
      .single()

    if (gameError || !gameRow) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Game not found.' } },
        { status: 404 }
      )
    }

    // Rate-limit check: max 3 wins per user per game per day
    const { count: winCount, error: countError } = await db
      .from('wins')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', internalUser.id)
      .eq('game_id', game_id)
      .eq('played_at', played_at)

    if (countError) {
      console.error('[api/wins] rate limit check', countError)
      return NextResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: 'Could not verify win count. Please try again.' } },
        { status: 500 }
      )
    }

    if ((winCount ?? 0) >= 3) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'You have already logged 3 wins for this game today. Come back tomorrow!',
          },
        },
        { status: 429 }
      )
    }

    // Insert the win row
    const { data: insertedWin, error: insertError } = await db
      .from('wins')
      .insert({
        user_id: internalUser.id,
        game_id,
        played_at,
        opponents: opponents ?? null,
      })
      .select('id, user_id, game_id, played_at, opponents, created_at')
      .single()

    if (insertError || !insertedWin) {
      console.error('[api/wins] insert', insertError)
      return NextResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: 'Failed to log your win. Please try again.' } },
        { status: 500 }
      )
    }

    const win = insertedWin as WinRow

    return NextResponse.json({ win }, { status: 201 })
  } catch (error) {
    console.error('[api/wins]', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to log your win. Please try again.' } },
      { status: 500 }
    )
  }
}
