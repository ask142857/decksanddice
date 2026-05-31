import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { XMLParser } from 'fast-xml-parser'
import { createApi } from 'unsplash-js'
import type { Basic } from 'unsplash-js/data-types'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY
const bggApiToken = process.env.BGG_API_TOKEN

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

if (!unsplashAccessKey) {
  console.error('Missing UNSPLASH_ACCESS_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const unsplash = createApi({ accessKey: unsplashAccessKey })

interface GameSeed {
  slug: string
  bggId: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface BggData {
  name: string
  description: string
  how_to_play: string
  min_players: number
  max_players: number
  playtime_minutes: number
}

interface ImageData {
  url: string
  alt_text: string
  is_cover: boolean
  sort_order: number
}

const GAMES_TO_SEED: GameSeed[] = [
  { slug: 'catan', bggId: 13, difficulty: 'Medium' },
  { slug: 'splendor', bggId: 148228, difficulty: 'Easy' },
  { slug: 'ticket-to-ride', bggId: 9209, difficulty: 'Easy' },
  { slug: 'pandemic', bggId: 30549, difficulty: 'Medium' },
  { slug: 'codenames', bggId: 178900, difficulty: 'Easy' },
  { slug: 'azul', bggId: 230802, difficulty: 'Medium' },
  { slug: 'carcassonne', bggId: 822, difficulty: 'Easy' },
]

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#10;/g, '\n')
    .replace(/&#13;/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchBggData(bggId: number, slug: string, attempt = 1): Promise<BggData | null> {
  if (attempt > 5) {
    console.error(`[BGG] Exceeded max retries for ${slug} (bggId=${bggId})`)
    return null
  }

  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${bggId}&stats=1`

  const headers: Record<string, string> = {
    Accept: 'application/xml',
  }

  if (bggApiToken) {
    headers['Authorization'] = `Bearer ${bggApiToken}`
  }

  let response: Response
  try {
    response = await fetch(url, { headers })
  } catch (err) {
    console.error(`[BGG] Network error fetching ${slug} (bggId=${bggId}):`, err)
    return null
  }

  // BGG returns 202 when the request is queued — retry after a delay
  if (response.status === 202) {
    console.warn(`[BGG] Got 202 for ${slug} (attempt ${attempt}) — retrying in 2s...`)
    await delay(2000)
    return fetchBggData(bggId, slug, attempt + 1)
  }

  if (!response.ok) {
    console.error(`[BGG] HTTP ${response.status} for ${slug} (bggId=${bggId})`)
    return null
  }

  const xml = await response.text()

  if (!xml || xml.trim().length === 0) {
    console.error(`[BGG] Empty response body for ${slug}`)
    return null
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => ['name', 'link'].includes(name),
  })

  let parsed: Record<string, unknown>
  try {
    parsed = parser.parse(xml) as Record<string, unknown>
  } catch (err) {
    console.error(`[BGG] XML parse error for ${slug}:`, err)
    return null
  }

  const items = parsed['items'] as Record<string, unknown> | undefined
  if (!items) {
    console.error(`[BGG] No <items> element in response for ${slug}`)
    return null
  }

  const item = items['item'] as Record<string, unknown> | undefined
  if (!item) {
    console.error(`[BGG] No <item> element in response for ${slug}`)
    return null
  }

  const namesRaw = item['name'] as Array<Record<string, unknown>> | undefined
  let gameName = slugToDisplayName(slug)
  if (namesRaw && Array.isArray(namesRaw)) {
    const primaryName = namesRaw.find((n) => n['@_type'] === 'primary')
    if (primaryName && typeof primaryName['@_value'] === 'string') {
      gameName = primaryName['@_value']
    }
  }

  const descriptionRaw = item['description']
  const description = typeof descriptionRaw === 'string' ? decodeHtmlEntities(descriptionRaw) : ''
  const howToPlay = description || `Learn how to play ${gameName} at Decks and Dice!`

  const shortDescription =
    howToPlay.length > 300 ? howToPlay.slice(0, 297) + '...' : howToPlay

  const minPlayersRaw = (item['minplayers'] as Record<string, unknown> | undefined)?.['@_value']
  const maxPlayersRaw = (item['maxplayers'] as Record<string, unknown> | undefined)?.['@_value']
  const playtimeRaw = (item['playingtime'] as Record<string, unknown> | undefined)?.['@_value']

  const minPlayers = parseInt(String(minPlayersRaw ?? '2'), 10) || 2
  const maxPlayers = parseInt(String(maxPlayersRaw ?? '4'), 10) || 4
  const playtimeMinutes = parseInt(String(playtimeRaw ?? '60'), 10) || 60

  return {
    name: gameName,
    description: shortDescription,
    how_to_play: howToPlay,
    min_players: minPlayers,
    max_players: Math.max(minPlayers, maxPlayers),
    playtime_minutes: playtimeMinutes,
  }
}

async function fetchUnsplashImages(gameName: string, slug: string): Promise<ImageData[]> {
  const query = `${gameName} board game`

  let result: Awaited<ReturnType<typeof unsplash.search.getPhotos>>
  try {
    result = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: 5,
    })
  } catch (err) {
    console.error(`[Unsplash] Network error for ${slug}:`, err)
    return []
  }

  if (result.errors) {
    console.error(`[Unsplash] API error for ${slug}:`, result.errors)
    return []
  }

  const photos: Basic[] = result.response?.results ?? []

  if (photos.length === 0) {
    console.warn(`[Unsplash] No photos found for query: "${query}"`)
    return []
  }

  return photos.map((photo, index) => ({
    url: photo.urls.regular,
    alt_text: photo.alt_description || `${gameName} board game`,
    is_cover: index === 0,
    sort_order: index,
  }))
}

async function seedGame(gameSeed: GameSeed): Promise<boolean> {
  const { slug, bggId, difficulty } = gameSeed
  console.log(`\n[${slug}] Starting seed...`)

  const bggData = await fetchBggData(bggId, slug)
  if (!bggData) {
    console.error(`[${slug}] Failed to fetch BGG data — skipping game.`)
    return false
  }

  console.log(
    `[${slug}] BGG data fetched: "${bggData.name}" (${bggData.min_players}–${bggData.max_players} players, ${bggData.playtime_minutes}min)`
  )

  const images = await fetchUnsplashImages(bggData.name, slug)

  if (images.length < 3) {
    console.warn(
      `[${slug}] Only ${images.length} images found (minimum 3 required) — skipping game.`
    )
    return false
  }

  console.log(`[${slug}] ${images.length} Unsplash images fetched.`)

  const gameRow = {
    slug,
    name: bggData.name,
    description: bggData.description,
    how_to_play: bggData.how_to_play,
    min_players: bggData.min_players,
    max_players: bggData.max_players,
    playtime_minutes: bggData.playtime_minutes,
    difficulty,
    bgg_id: bggId,
  }

  const { data: upsertedGame, error: upsertError } = await supabase
    .from('games')
    .upsert(gameRow, { onConflict: 'slug' })
    .select('id')
    .single()

  if (upsertError || !upsertedGame) {
    console.error(`[${slug}] Failed to upsert game:`, upsertError)
    return false
  }

  const gameId: string = upsertedGame.id
  console.log(`[${slug}] Game upserted with id: ${gameId}`)

  const { error: deleteError } = await supabase
    .from('game_images')
    .delete()
    .eq('game_id', gameId)

  if (deleteError) {
    console.error(`[${slug}] Failed to delete existing images:`, deleteError)
    return false
  }

  const imageRows = images.map((img) => ({
    game_id: gameId,
    url: img.url,
    alt_text: img.alt_text,
    is_cover: img.is_cover,
    sort_order: img.sort_order,
  }))

  const { error: insertImagesError } = await supabase.from('game_images').insert(imageRows)

  if (insertImagesError) {
    console.error(`[${slug}] Failed to insert images:`, insertImagesError)
    return false
  }

  console.log(`[${slug}] ✓ Seeded successfully with ${imageRows.length} images.`)
  return true
}

async function main(): Promise<void> {
  console.log('=== DecksAndDice Seed Script ===')
  console.log(`Seeding ${GAMES_TO_SEED.length} games...\n`)

  let successCount = 0
  let failCount = 0

  for (const gameSeed of GAMES_TO_SEED) {
    const success = await seedGame(gameSeed)
    if (success) {
      successCount++
    } else {
      failCount++
    }

    // Respect BGG and Unsplash rate limits between games
    await delay(1000)
  }

  console.log(`\n=== Seed Complete ===`)
  console.log(`✓ ${successCount} games seeded successfully`)
  if (failCount > 0) {
    console.error(
      `✗ ${failCount} games failed — check errors above and fix data in Supabase manually`
    )
  }

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('[seed] Unexpected error:', err)
  process.exit(1)
})
