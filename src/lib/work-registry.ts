/** Work Registry: one list for the home Work view.
 *  Current projects (`src/data/projects.ts`) first, then older Content Collections MDX proofs.
 */
import { getCollection } from "astro:content";
import { isPendingUrl, type Domain } from "@/data/lab-precision";
import { currentProjects, selectedWorkOrder, type WorkStatus } from "@/data/projects";

export type WorkLocale = "en" | "fr";

function normalizeDomain(raw: string): Domain {
  const lower = raw.toLowerCase();
  if (lower.includes("fintech")) return "Fintech";
  if (lower.includes("erp")) return "ERP & QA";
  if (lower.includes("judgment") || lower === "systems") return "Systems";
  return "Operations";
}

/** Row title: text before an em/en dash subtitle. */
function shortName(title: string): string {
  const parts = title.split(/\s+[—–]\s+/);
  return (parts[0] ?? title).trim() || title;
}

/** Visible UI copy: no em/en dashes (hyphen only). */
function uiDash(value: string): string {
  return value.replace(/\s*[—–]\s*/g, " - ");
}

export interface WorkRow {
  slug: string;
  name: string;
  url?: string;
  host?: string;
  status: WorkStatus;
  domain: Domain;
  date: string;
  what: string;
  /** True for `currentProjects`; they lead the default "Selected" order. */
  current: boolean;
}

/** Current projects first, then older MDX proofs by date. A proof whose slug is a current project is skipped. */
export async function getWorkRows(locale: WorkLocale = "en"): Promise<WorkRow[]> {
  const isFr = locale === "fr";
  const current: WorkRow[] = currentProjects.map((p) => ({
    slug: p.slug,
    name: p.name,
    url: p.url,
    host: p.host,
    status: p.status,
    domain: p.domain,
    date: p.date,
    what: isFr ? p.whatFr : p.what,
    current: true,
  }));
  const taken = new Set(current.map((r) => r.slug));
  const entries = await getCollection("work", (entry) => entry.id.endsWith("/en"));
  const older: WorkRow[] = entries
    .map((entry) => ({ entry, slug: entry.id.replace(/\/(en|fr)$/, "") }))
    .filter(({ slug }) => !taken.has(slug))
    .map(({ entry, slug }) => {
      const d = entry.data;
      const link = d.surfaces.find((s) => s.url && !isPendingUrl(s.url));
      const status: WorkStatus =
        d.status === "archived" ? "stopped" : link ? "live" : d.status === "shipped" ? "private" : "building";
      return {
        slug,
        name: shortName(isFr ? (d.titleFr ?? d.title) : d.title),
        url: link?.url,
        host: link ? (link.urlLabel ?? link.url!.replace(/^https?:\/\//, "")).replace(/\/$/, "") : undefined,
        status,
        domain: normalizeDomain(d.domain),
        date: d.date,
        what: uiDash(isFr ? (d.summaryFr ?? d.summary) : d.summary),
        current: false,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const rank = new Map(selectedWorkOrder.map((slug, i) => [slug, i]));
  const all = [...current, ...older];
  all.sort((a, b) => {
    const ra = rank.get(a.slug) ?? 999;
    const rb = rank.get(b.slug) ?? 999;
    if (ra !== rb) return ra - rb;
    return b.date.localeCompare(a.date);
  });
  return all;
}
