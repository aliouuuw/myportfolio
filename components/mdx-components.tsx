import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

function proseClass(extra: string) {
  return extra;
}

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className={proseClass(
        "font-serif text-3xl font-normal tracking-tight text-ink-primary first:mt-0 mt-12 mb-4",
      )}
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className={proseClass(
        "font-sans text-xl font-semibold tracking-tight text-ink-primary mt-12 mb-3",
      )}
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className={proseClass(
        "font-sans text-base font-semibold text-ink-primary mt-8 mb-2",
      )}
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      className={proseClass("text-ink-secondary leading-relaxed mb-4 last:mb-0")}
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={proseClass(
        "list-disc pl-5 text-ink-secondary space-y-2 mb-6 marker:text-ink-tertiary",
      )}
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={proseClass(
        "list-decimal pl-5 text-ink-secondary space-y-2 mb-6 marker:tabular-nums",
      )}
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className={proseClass("leading-relaxed")} {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className={proseClass("font-semibold text-ink-primary")} {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className={proseClass(
        "text-ink-primary underline decoration-border underline-offset-4 transition-colors hover:decoration-ink-tertiary",
      )}
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-0 hairline" />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={proseClass(
        "border-l border-border-strong pl-5 my-6 text-ink-tertiary italic font-serif text-[0.95em]",
      )}
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className={proseClass(
        "rounded border border-border bg-canvas-subtle px-1.5 py-0.5 text-[0.9em] tabular-nums text-ink-primary",
      )}
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={proseClass(
        "overflow-x-auto rounded border border-border bg-canvas-elevated p-4 text-sm text-ink-secondary mb-6",
      )}
      {...props}
    />
  ),
};
