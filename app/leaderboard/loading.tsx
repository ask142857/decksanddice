import { LeaderboardSkeleton } from '@/components/leaderboard/LeaderboardSkeleton'

export default function LeaderboardLoading() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LeaderboardSkeleton />
    </main>
  )
}
