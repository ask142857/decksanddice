export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="skeleton h-8 w-64 rounded-lg" />
          <div className="skeleton h-4 w-48 rounded-md" />
        </div>
        <div className="skeleton h-10 w-32 rounded-xl" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="skeleton h-4 w-24 rounded-md" />
              <div className="skeleton h-8 w-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent wins skeleton */}
      <div>
        <div className="skeleton h-6 w-32 rounded-md mb-4" />
        <div className="glass-card divide-y" style={{ borderColor: 'var(--border)' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="skeleton w-12 h-12 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-40 rounded-md" />
                <div className="skeleton h-3 w-28 rounded-md" />
              </div>
              <div className="skeleton h-4 w-20 rounded-md flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
