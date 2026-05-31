export function LeaderboardSkeleton() {
  return (
    <div style={{ maxWidth: 672, margin: '0 auto', padding: '48px 16px' }}>
      {/* Heading skeleton */}
      <div style={{ marginBottom: 32 }}>
        <div
          className="skeleton"
          style={{ height: 40, width: '40%', marginBottom: 12, borderRadius: 8 }}
        />
        <div
          className="skeleton"
          style={{ height: 20, width: '60%', marginBottom: 16, borderRadius: 6 }}
        />
        <div
          className="skeleton"
          style={{ height: 24, width: 160, borderRadius: 100 }}
        />
      </div>

      {/* Row skeletons */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 20px',
              borderBottom:
                i < 6 ? '1px solid var(--border)' : 'none',
            }}
          >
            {/* Rank */}
            <div
              className="skeleton"
              style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }}
            />
            {/* Avatar */}
            <div
              className="skeleton skeleton-avatar"
              style={{ width: 38, height: 38, flexShrink: 0 }}
            />
            {/* Name */}
            <div style={{ flex: 1 }}>
              <div
                className="skeleton"
                style={{ height: 16, width: `${40 + (i % 3) * 15}%`, borderRadius: 6 }}
              />
            </div>
            {/* Win count */}
            <div
              className="skeleton"
              style={{ height: 16, width: 60, borderRadius: 6, flexShrink: 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
