import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-10">
      <DashboardSkeleton />
    </div>
  )
}
