/** Loading state for /writing — minimal placeholder list. */
export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-24 pb-12 sm:px-12 lg:px-24">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">
          Field notes
        </p>
        <div className="h-10 w-48 bg-canvas-elevated/60" />
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 pb-12 sm:px-12 lg:px-24">
        <div className="hairline mb-2" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-b border-border py-5"
          >
            <div className="h-3 w-32 bg-canvas-elevated/40" />
            <div className="h-5 w-full max-w-[48ch] bg-canvas-elevated/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
