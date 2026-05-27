/** Loading state for /work — neo-ledger skeleton rows. */
export default function Loading() {
  return (
    <div className="site-ledger mx-auto flex w-full max-w-[var(--n-page)] flex-1 flex-col px-[var(--n-gutter)] py-24 text-[var(--n-fg)]">
      <header className="mb-12 max-w-2xl animate-pulse">
        <div className="h-10 w-48 rounded-sm bg-[var(--n-bg-surface)]" />
        <div className="mt-4 h-4 w-full max-w-md rounded-sm bg-[var(--n-bg-surface)]" />
      </header>
      <ul className="flex flex-col border-t border-[color:var(--n-border)]">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-4 border-b border-[color:var(--n-border)] py-5 animate-pulse"
          >
            <div className="h-4 flex-1 max-w-[36ch] rounded-sm bg-[var(--n-bg-surface)]" />
            <div className="h-3 w-20 rounded-sm bg-[var(--n-bg-surface)]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
