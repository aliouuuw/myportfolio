/** Loading state for /writing/[slug] — minimal, design-v3 aesthetic. */
export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-24 pb-12 sm:px-12 lg:px-24">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">
          Field note · ···
        </p>
        <div className="h-12 w-3/4 max-w-[40ch] bg-canvas-elevated/60" />
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 pb-12 sm:px-12 lg:px-24">
        <div className="hairline mb-10" />
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">
          Retrieving note…
        </p>
      </div>
    </div>
  );
}
