export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        {/* Header skeleton */}
        <header className="mb-16">
          <div className="h-10 w-48 bg-canvas-elevated animate-pulse rounded mb-4" />
          <div className="h-4 w-96 bg-canvas-elevated animate-pulse rounded" />
        </header>

        {/* Case study cards skeleton */}
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border bg-canvas"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-4 w-24 bg-canvas-elevated animate-pulse rounded" />
                <div className="h-4 w-16 bg-canvas-elevated animate-pulse rounded" />
              </div>
              <div className="h-6 w-full bg-canvas-elevated animate-pulse rounded mb-3" />
              <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded mb-2" />
              <div className="h-4 w-3/4 bg-canvas-elevated animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
