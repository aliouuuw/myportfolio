/** Loading state for /work — minimal placeholder rows that mirror FileReferenceRow. */
export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-24 pb-12 sm:px-12 lg:px-24">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">
          Operational record
        </p>
        <div className="h-10 w-48 bg-canvas-elevated/60" />
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 pb-12 sm:px-12 lg:px-24">
        <div className="hairline mb-2" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-border py-5"
          >
            <span className="font-mono text-[11px] tracking-tight text-ink-tertiary">
              CF-00{i}
            </span>
            <div className="h-4 flex-1 max-w-[42ch] bg-canvas-elevated/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
