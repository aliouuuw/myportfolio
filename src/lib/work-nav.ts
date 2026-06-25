import type { CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;

export function workSlug(entry: WorkEntry): string {
  return entry.id.replace(/\/(en|fr)$/, "");
}

export function workTitle(entry: WorkEntry, lang: "en" | "fr"): string {
  if (lang === "fr") return entry.data.titleFr ?? entry.data.title;
  return entry.data.title;
}

export function sortWorkEntries(entries: WorkEntry[]): WorkEntry[] {
  return [...entries].sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.date.localeCompare(a.data.date);
  });
}

export function adjacentWork(
  entries: WorkEntry[],
  slug: string,
): { prev: WorkEntry | null; next: WorkEntry | null } {
  const sorted = sortWorkEntries(entries);
  const index = sorted.findIndex((e) => workSlug(e) === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 ? sorted[index + 1]! : null,
  };
}
