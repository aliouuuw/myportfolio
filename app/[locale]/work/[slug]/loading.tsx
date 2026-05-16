export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        {/* Back link skeleton */}
        <div className="mb-12">
          <div className="h-4 w-24 bg-canvas-elevated animate-pulse rounded" />
        </div>

        {/* Article header skeleton */}
        <header className="mb-16 pb-12 border-b border-border">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-3 w-20 bg-canvas-elevated animate-pulse rounded" />
            <div className="h-5 w-24 bg-canvas-elevated animate-pulse rounded" />
          </div>

          <div className="h-12 w-full max-w-2xl bg-canvas-elevated animate-pulse rounded mb-6" />

          <div className="flex items-center gap-4 mb-8">
            <div className="h-4 w-32 bg-canvas-elevated animate-pulse rounded" />
            <div className="h-4 w-1 bg-canvas-elevated animate-pulse rounded" />
            <div className="h-4 w-28 bg-canvas-elevated animate-pulse rounded" />
          </div>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-6 w-20 bg-canvas-elevated animate-pulse rounded"
              />
            ))}
          </div>
        </header>

        {/* MDX body skeleton */}
        <div className="max-w-2xl space-y-4">
          <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded" />
          <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-canvas-elevated animate-pulse rounded" />
          <div className="h-8" />
          <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded" />
          <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-canvas-elevated animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
