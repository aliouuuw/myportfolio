/** Loading state for the homepage — mirrors the identity block layout. */
export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-5xl px-6 pt-32 pb-16 sm:px-12 lg:px-24">
        <div className="mb-6 h-16 w-72 bg-canvas-elevated/60" />
        <div className="mb-6 h-3 w-40 bg-canvas-elevated/40" />
        <div className="mb-2 h-5 w-full max-w-[48ch] bg-canvas-elevated/40" />
        <div className="h-5 w-3/4 max-w-[36ch] bg-canvas-elevated/40" />
      </section>
    </div>
  );
}
