import { readWorkFrontmatter } from "@/lib/mdx";
import {
  FEATURED_WORK_SLUGS,
  type FeaturedWorkSlug,
} from "@/lib/work-ledger-types";

export type CaseStudyNavLink = {
  slug: FeaturedWorkSlug;
  title: string;
};

function localizedTitle(
  locale: string,
  en: string,
  fr: string,
): string {
  return locale === "fr" ? fr : en;
}

export async function getFeaturedCaseStudyNav(
  locale: string,
  currentSlug: string,
): Promise<{
  prev: CaseStudyNavLink | null;
  next: CaseStudyNavLink | null;
}> {
  const index = FEATURED_WORK_SLUGS.indexOf(currentSlug as FeaturedWorkSlug);
  if (index < 0) {
    return { prev: null, next: null };
  }

  const prevSlug = index > 0 ? FEATURED_WORK_SLUGS[index - 1] : null;
  const nextSlug =
    index < FEATURED_WORK_SLUGS.length - 1
      ? FEATURED_WORK_SLUGS[index + 1]
      : null;

  const resolve = async (
    slug: FeaturedWorkSlug,
  ): Promise<CaseStudyNavLink> => {
    const fm = await readWorkFrontmatter(slug, locale);
    return {
      slug,
      title: localizedTitle(locale, fm.title, fm.titleFr),
    };
  };

  return {
    prev: prevSlug ? await resolve(prevSlug) : null,
    next: nextSlug ? await resolve(nextSlug) : null,
  };
}
