import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="font-sans text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-ink-primary first:mt-0 mt-14 mb-4 leading-[1.15]"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="font-sans text-[1.5rem] font-semibold tracking-tight text-ink-primary mt-12 mb-3 leading-[1.2]"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="font-sans text-[1.125rem] font-semibold text-ink-primary mt-8 mb-2"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-ink-secondary leading-relaxed mb-5 last:mb-0" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc pl-5 text-ink-secondary space-y-2 mb-6 marker:text-ink-muted"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal pl-5 text-ink-secondary space-y-2 mb-6 marker:tabular-nums marker:text-ink-muted"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink-primary" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => <a className="link" {...props} />,
  hr: () => <hr className="my-12 hairline" />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-2 border-accent pl-5 my-8 text-ink-primary font-medium not-italic"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded border border-border bg-canvas-elevated px-1.5 py-0.5 text-[0.9em] font-mono text-ink-primary"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="overflow-x-auto rounded-lg border border-border bg-canvas-elevated p-4 text-[14px] text-ink-secondary mb-6 font-mono"
      {...props}
    />
  ),
};
