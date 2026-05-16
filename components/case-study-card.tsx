import Link from "next/link";

type CaseStudyCardProps = {
  href: string;
  category: string;
  title: string;
  description: string;
};

export function CaseStudyCard({
  href,
  category,
  title,
  description,
}: CaseStudyCardProps) {
  return (
    <Link
      href={href}
      className="card-metallic rounded-md p-8 flex flex-col gap-4 group"
    >
      <span className="card-category text-xs font-medium tracking-widest uppercase">
        {category}
      </span>
      <h3 className="card-title text-lg font-medium">{title}</h3>
      <p className="card-desc text-sm leading-relaxed mt-auto pt-4">
        {description}
      </p>
    </Link>
  );
}
