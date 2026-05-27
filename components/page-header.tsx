interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="page-shell pt-28 pb-12 sm:pt-36">
      {eyebrow && <p className="label-micro mb-4">{eyebrow}</p>}
      <h1 className="font-sans text-[clamp(2.5rem,7vw,4.5rem)] font-medium tracking-tight text-ink-primary leading-[1.1] mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-ink-secondary max-w-[60ch] leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}
