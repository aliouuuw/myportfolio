import Link from "next/link";

export type FileReferenceStatus = "ACTIVE" | "SHIPPED" | "ARCHIVED";

interface FileReferenceRowProps {
  fileRef: string;
  title: string;
  domain: string;
  year: string;
  status: FileReferenceStatus;
  href: string;
}

const statusStyles: Record<FileReferenceStatus, string> = {
  ACTIVE: "text-accent",
  SHIPPED: "text-ink-secondary",
  ARCHIVED: "text-ink-tertiary",
};

export function FileReferenceRow({
  fileRef,
  title,
  domain,
  year,
  status,
  href,
}: FileReferenceRowProps) {
  return (
    <Link
      href={href}
      className="group relative flex items-baseline gap-4 sm:gap-6 py-5 transition-colors hover:text-ink-primary min-h-[44px]"
    >
      {/* Accent hairline that slides in from left on hover */}
      <span
        className="absolute left-0 top-0 h-full w-0.5 bg-accent origin-top scale-y-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
        aria-hidden="true"
      />

      {/* File ref */}
      <span
        className="font-mono text-[11px] font-medium text-ink-tertiary tracking-tight shrink-0 w-14"
        aria-hidden="true"
      >
        {fileRef}
      </span>

      {/* Title */}
      <span className="font-serif text-base text-ink-primary group-hover:text-accent transition-colors flex-1 min-w-0 truncate">
        {title}
      </span>

      {/* Domain */}
      <span className="font-mono text-[11px] text-ink-tertiary tracking-tight hidden sm:inline shrink-0">
        {domain}
      </span>

      {/* Year */}
      <span className="font-mono text-[11px] text-ink-tertiary tabular-nums shrink-0 text-right w-20">
        {year}
      </span>

      {/* Status */}
      <span
        className={`font-mono text-[10px] font-semibold uppercase tracking-wide shrink-0 w-16 text-right ${statusStyles[status]}`}
      >
        {status}
      </span>

      {/* Arrow */}
      <span className="text-ink-tertiary group-hover:text-accent transition-colors shrink-0">
        →
      </span>
    </Link>
  );
}

export default FileReferenceRow;
