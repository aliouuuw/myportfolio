import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ReactElement } from "react";

import { mdxComponents } from "@/components/mdx-components";

const ROOT = process.cwd();

export const WORK_CONTENT_DIR = path.join(ROOT, "content", "work");
export const WRITING_CONTENT_DIR = path.join(ROOT, "content", "writing");

/** Supported locales */
export const DEFAULT_LOCALE = "en";

/** Work ledger status — mock-to-production-plan.md §4C */
export type WorkLedgerStatus = "active" | "shipped" | "archived";

/** Case study frontmatter — portfolio-plan.md §9 + ledger fields §4C */
export type CaseStudyFrontmatter = {
  title: string;
  titleFr: string;
  summary: string;
  summaryFr: string;
  role: string;
  domain: string;
  stack: string[];
  date: string;
  featured: boolean;
  confidential: boolean;
  /** Ledger row (per-locale MDX file) */
  status?: WorkLedgerStatus;
  period?: string;
  proofClaim?: string;
  outcome?: string;
  heroImage?: string;
  relatedEssay?: string;
};

export type EssayFrontmatter = {
  title: string;
  titleFr: string;
  summary: string;
  summaryFr: string;
  date: string;
  /** Cross-link to anchor case study, e.g. bocalbun-retrospective */
  relatedCaseSlug?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown, field: string): string {
  if (typeof v === "string" && v.length > 0) return v;
  throw new Error(`MDX frontmatter: expected non-empty string for "${field}"`);
}

function asStringArray(v: unknown, field: string): string[] {
  if (!Array.isArray(v)) {
    throw new Error(`MDX frontmatter: expected string[] for "${field}"`);
  }
  if (!v.every((item) => typeof item === "string")) {
    throw new Error(`MDX frontmatter: "${field}" must be an array of strings`);
  }
  return v;
}

function asBoolean(v: unknown, field: string): boolean {
  if (typeof v === "boolean") return v;
  throw new Error(`MDX frontmatter: expected boolean for "${field}"`);
}

function asOptionalString(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "string" && v.length > 0) return v;
  return undefined;
}

function asOptionalWorkLedgerStatus(
  v: unknown,
): WorkLedgerStatus | undefined {
  if (v === undefined || v === null) return undefined;
  if (v === "active" || v === "shipped" || v === "archived") return v;
  throw new Error(
    'MDX frontmatter: status must be "active", "shipped", or "archived"',
  );
}

export function parseCaseStudyFrontmatter(
  raw: unknown,
): CaseStudyFrontmatter {
  if (!isRecord(raw)) {
    throw new Error("MDX frontmatter: expected YAML object");
  }
  return {
    title: asString(raw.title, "title"),
    titleFr: asString(raw.titleFr, "titleFr"),
    summary: asString(raw.summary, "summary"),
    summaryFr: asString(raw.summaryFr, "summaryFr"),
    role: asString(raw.role, "role"),
    domain: asString(raw.domain, "domain"),
    stack: asStringArray(raw.stack, "stack"),
    date: asString(raw.date, "date"),
    featured: asBoolean(raw.featured, "featured"),
    confidential: asBoolean(raw.confidential, "confidential"),
    status: asOptionalWorkLedgerStatus(raw.status),
    period: asOptionalString(raw.period),
    proofClaim: asOptionalString(raw.proofClaim),
    outcome: asOptionalString(raw.outcome),
    heroImage: asOptionalString(raw.heroImage),
    relatedEssay: asOptionalString(raw.relatedEssay),
  };
}

export function parseEssayFrontmatter(raw: unknown): EssayFrontmatter {
  if (!isRecord(raw)) {
    throw new Error("MDX frontmatter: expected YAML object");
  }
  return {
    title: asString(raw.title, "title"),
    titleFr: asString(raw.titleFr, "titleFr"),
    summary: asString(raw.summary, "summary"),
    summaryFr: asString(raw.summaryFr, "summaryFr"),
    date: asString(raw.date, "date"),
    relatedCaseSlug: asOptionalString(raw.relatedCaseSlug),
  };
}

/** Get the localized file path for a work case study */
export function getLocalizedWorkPath(slug: string, locale: string): string {
  // Try new structure: content/work/{slug}/{locale}.mdx
  return path.join(WORK_CONTENT_DIR, slug, `${locale}.mdx`);
}

/** Get the localized file path for a writing essay */
export function getLocalizedWritingPath(slug: string, locale: string): string {
  // Try new structure: content/writing/{slug}/{locale}.mdx
  return path.join(WRITING_CONTENT_DIR, slug, `${locale}.mdx`);
}

/** Get the legacy file path (for backwards compatibility) */
export function getLegacyWorkPath(slug: string): string {
  return path.join(WORK_CONTENT_DIR, `${slug}.mdx`);
}

export function getLegacyWritingPath(slug: string): string {
  return path.join(WRITING_CONTENT_DIR, `${slug}.mdx`);
}

/** Check if a file exists */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** List all work slugs from the new directory structure */
async function listWorkSlugsFromDirs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(WORK_CONTENT_DIR, { withFileTypes: true });
    const slugs: string[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Check if it has at least one .mdx file
        const subDir = path.join(WORK_CONTENT_DIR, entry.name);
        try {
          const files = await fs.readdir(subDir);
          if (files.some((f) => f.endsWith(".mdx"))) {
            slugs.push(entry.name);
          }
        } catch {
          // Ignore errors for individual directories
        }
      }
    }

    return slugs;
  } catch {
    return [];
  }
}

/** List all writing slugs from the new directory structure */
async function listWritingSlugsFromDirs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(WRITING_CONTENT_DIR, {
      withFileTypes: true,
    });
    const slugs: string[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Check if it has at least one .mdx file
        const subDir = path.join(WRITING_CONTENT_DIR, entry.name);
        try {
          const files = await fs.readdir(subDir);
          if (files.some((f) => f.endsWith(".mdx"))) {
            slugs.push(entry.name);
          }
        } catch {
          // Ignore errors for individual directories
        }
      }
    }

    return slugs;
  } catch {
    return [];
  }
}

/** List slugs from legacy flat structure */
async function listMdxSlugs(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""));
}

/** Get all work slugs (combines new directory structure and legacy) */
export async function getWorkSlugs(): Promise<string[]> {
  const dirSlugs = await listWorkSlugsFromDirs();
  const legacySlugs = await listMdxSlugs(WORK_CONTENT_DIR);

  // Combine and deduplicate
  const allSlugs = new Set([...dirSlugs, ...legacySlugs]);
  return Array.from(allSlugs).sort();
}

/** Get all writing slugs (combines new directory structure and legacy) */
export async function getWritingSlugs(): Promise<string[]> {
  const dirSlugs = await listWritingSlugsFromDirs();
  const legacySlugs = await listMdxSlugs(WRITING_CONTENT_DIR);

  // Combine and deduplicate
  const allSlugs = new Set([...dirSlugs, ...legacySlugs]);
  return Array.from(allSlugs).sort();
}

/** Resolve work file path with fallback to legacy structure */
async function resolveWorkFilePath(
  slug: string,
  locale: string,
): Promise<string> {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  // Try new structure first: content/work/{slug}/{locale}.mdx
  const localizedPath = getLocalizedWorkPath(slug, locale);
  if (await fileExists(localizedPath)) {
    return localizedPath;
  }

  // Fall back to default locale if requested locale doesn't exist
  if (locale !== DEFAULT_LOCALE) {
    const defaultPath = getLocalizedWorkPath(slug, DEFAULT_LOCALE);
    if (await fileExists(defaultPath)) {
      return defaultPath;
    }
  }

  // Fall back to legacy structure: content/work/{slug}.mdx
  const legacyPath = getLegacyWorkPath(slug);
  if (await fileExists(legacyPath)) {
    return legacyPath;
  }

  // Return the localized path even if it doesn't exist, so we get a proper error
  return localizedPath;
}

/** Resolve writing file path with fallback to legacy structure */
async function resolveWritingFilePath(
  slug: string,
  locale: string,
): Promise<string> {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  // Try new structure first: content/writing/{slug}/{locale}.mdx
  const localizedPath = getLocalizedWritingPath(slug, locale);
  if (await fileExists(localizedPath)) {
    return localizedPath;
  }

  // Fall back to default locale if requested locale doesn't exist
  if (locale !== DEFAULT_LOCALE) {
    const defaultPath = getLocalizedWritingPath(slug, DEFAULT_LOCALE);
    if (await fileExists(defaultPath)) {
      return defaultPath;
    }
  }

  // Fall back to legacy structure: content/writing/{slug}.mdx
  const legacyPath = getLegacyWritingPath(slug);
  if (await fileExists(legacyPath)) {
    return legacyPath;
  }

  // Return the localized path even if it doesn't exist, so we get a proper error
  return localizedPath;
}

export async function readWorkFrontmatter(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): Promise<CaseStudyFrontmatter> {
  const filePath = await resolveWorkFilePath(slug, locale);
  const raw = await fs.readFile(filePath, "utf8");
  const { data } = matter(raw);
  return parseCaseStudyFrontmatter(data);
}

export async function readWritingFrontmatter(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): Promise<EssayFrontmatter> {
  const filePath = await resolveWritingFilePath(slug, locale);
  const raw = await fs.readFile(filePath, "utf8");
  const { data } = matter(raw);
  return parseEssayFrontmatter(data);
}

async function compileMdxFile<T>(
  absolutePath: string,
  parseFrontmatter: (raw: unknown) => T,
): Promise<{ content: ReactElement; frontmatter: T }> {
  const source = await fs.readFile(absolutePath, "utf8");
  const { content, frontmatter: rawFm } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: mdxComponents,
  });
  const frontmatter = parseFrontmatter(rawFm);
  return { content, frontmatter };
}

export async function compileWorkBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): Promise<{
  content: ReactElement;
  frontmatter: CaseStudyFrontmatter;
}> {
  const filePath = await resolveWorkFilePath(slug, locale);
  return compileMdxFile(filePath, parseCaseStudyFrontmatter);
}

export async function compileWritingBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): Promise<{
  content: ReactElement;
  frontmatter: EssayFrontmatter;
}> {
  const filePath = await resolveWritingFilePath(slug, locale);
  return compileMdxFile(filePath, parseEssayFrontmatter);
}
