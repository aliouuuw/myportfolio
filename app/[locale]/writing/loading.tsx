export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        {/* Header skeleton */}
        <header className="mb-16">
          <div className="h-10 w-40 bg-canvas-elevated animate-pulse rounded mb-4" />
          <div className="h-4 w-80 bg-canvas-elevated animate-pulse rounded" />
        </header>

        {/* Essay cards skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border bg-canvas"
            >
              <div className="h-3 w-28 bg-canvas-elevated animate-pulse rounded mb-4" />
              <div className="h-6 w-full max-w-lg bg-canvas-elevated animate-pulse rounded mb-3" />
              <div className="h-4 w-full bg-canvas-elevated animate-pulse rounded mb-2" />
              <div className="h-4 w-2/3 bg-canvas-elevated animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
