export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        {/* Hero skeleton */}
        <div className="max-w-2xl">
          <div className="h-12 w-64 bg-canvas-elevated animate-pulse rounded mb-6" />
          <div className="h-6 w-48 bg-canvas-elevated animate-pulse rounded mb-4" />
          <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded mb-2" />
          <div className="h-4 w-5/6 bg-canvas-elevated animate-pulse rounded" />
        </div>

        {/* Case studies skeleton */}
        <div className="mt-24">
          <div className="h-6 w-40 bg-canvas-elevated animate-pulse rounded mb-3" />
          <div className="h-4 w-72 bg-canvas-elevated animate-pulse rounded mb-12" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-border bg-canvas"
              >
                <div className="h-4 w-24 bg-canvas-elevated animate-pulse rounded mb-3" />
                <div className="h-6 w-full bg-canvas-elevated animate-pulse rounded mb-2" />
                <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
