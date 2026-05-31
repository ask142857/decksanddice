export function GameSkeleton() {
  return (
    <div
      className="glass-card flex flex-col overflow-hidden"
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div
        className="skeleton w-full"
        style={{ aspectRatio: '16/9' }}
      />

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title */}
        <div className="skeleton skeleton-title w-3/4" />

        {/* Description lines */}
        <div className="flex flex-col gap-2">
          <div className="skeleton skeleton-text w-full" />
          <div className="skeleton skeleton-text w-5/6" />
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-1">
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>

        {/* Button */}
        <div className="skeleton h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}
