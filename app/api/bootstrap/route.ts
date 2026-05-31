import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/service'

interface UserRow {
  id: string
}

export async function POST(): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'You need to be signed in.' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any

    // Check if user row already exists — idempotent
    const { data: existingUser } = await db
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    const existing = existingUser as UserRow | null

    if (existing) {
      return NextResponse.json({ success: true })
    }

    // Fetch user details from Clerk
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)

    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      return NextResponse.json(
        { error: 'No email address found on your account.' },
        { status: 400 }
      )
    }

    const firstName = clerkUser.firstName ?? ''
    const lastName = clerkUser.lastName ?? ''
    const displayName = [firstName, lastName].filter(Boolean).join(' ') || email
    const avatarUrl = clerkUser.imageUrl ?? null

    const { error: insertError } = await db.from('users').insert({
      clerk_user_id: userId,
      email,
      display_name: displayName,
      avatar_url: avatarUrl,
    })

    if (insertError) {
      console.error('[api/bootstrap]', insertError)
      return NextResponse.json(
        { error: 'Setup failed. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[api/bootstrap]', error)
    return NextResponse.json(
      { error: 'Setup failed. Please try again.' },
      { status: 500 }
    )
  }
}
