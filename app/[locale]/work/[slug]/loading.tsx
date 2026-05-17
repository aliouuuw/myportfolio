/**
 * Loading state for /work/[slug] — mirrors CaseReportHeader structure so the
 * layout doesn't shift when MDX streams in. Minimal, classified-record aesthetic.
 */
export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-24 pb-12 sm:px-12 lg:px-24">
        <div className="mb-8 flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-tight text-ink-tertiary">
            FILE: ···
          </span>
          <span className="text-ink-muted" aria-hidden="true">·</span>
          <span className="font-mono text-[11px] uppercase tracking-tight text-ink-tertiary">
            CLASSIFICATION: ···
          </span>
        </div>
        <div className="mb-12 h-12 w-3/4 max-w-[40ch] bg-canvas-elevated/60" />
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="h-12 max-w-[40ch] bg-canvas-elevated/40" />
          <div className="h-12 max-w-[40ch] bg-canvas-elevated/40" />
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 pt-4 pb-12 sm:px-12 lg:px-24">
        <div className="hairline mb-10" />
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">
          Retrieving file…
        </p>
      </div>
    </div>
  );
}
