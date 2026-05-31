import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for use in Client Components.
 * Call this inside a Client Component or event handler.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
