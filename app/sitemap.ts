import type { MetadataRoute } from "next";
import { getWorkSlugs, getWritingSlugs } from "@/lib/mdx";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aliouwade.com";

const locales = ["en", "fr"] as const;

const staticPaths = ["", "/work", "/writing"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workSlugs, writingSlugs] = await Promise.all([
    getWorkSlugs(),
    getWritingSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((p) => ({
      url: `${SITE_URL}/${locale}${p}`,
      lastModified: new Date(),
      changeFrequency: (p === "" ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      priority: p === "" ? 1 : 0.8,
    })),
  );

  const workEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    workSlugs.map((slug) => ({
      url: `${SITE_URL}/${locale}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  );

  const writingEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    writingSlugs.map((slug) => ({
      url: `${SITE_URL}/${locale}/writing/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...workEntries, ...writingEntries];
}
