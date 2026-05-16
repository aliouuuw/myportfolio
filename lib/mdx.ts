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

/** Case study frontmatter — portfolio-plan.md §9 */
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
};

export type EssayFrontmatter = {
  title: string;
  titleFr: string;
  summary: string;
  summaryFr: string;
  date: string;
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
  };
}

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

export async function getWorkSlugs(): Promise<string[]> {
  return listMdxSlugs(WORK_CONTENT_DIR);
}

export async function getWritingSlugs(): Promise<string[]> {
  return listMdxSlugs(WRITING_CONTENT_DIR);
}

export async function readWorkFrontmatter(
  slug: string,
): Promise<CaseStudyFrontmatter> {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
  const filePath = path.join(WORK_CONTENT_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const { data } = matter(raw);
  return parseCaseStudyFrontmatter(data);
}

export async function readWritingFrontmatter(
  slug: string,
): Promise<EssayFrontmatter> {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
  const filePath = path.join(WRITING_CONTENT_DIR, `${slug}.mdx`);
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

export async function compileWorkBySlug(slug: string): Promise<{
  content: ReactElement;
  frontmatter: CaseStudyFrontmatter;
}> {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
  const filePath = path.join(WORK_CONTENT_DIR, `${slug}.mdx`);
  return compileMdxFile(filePath, parseCaseStudyFrontmatter);
}

export async function compileWritingBySlug(slug: string): Promise<{
  content: ReactElement;
  frontmatter: EssayFrontmatter;
}> {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
  const filePath = path.join(WRITING_CONTENT_DIR, `${slug}.mdx`);
  return compileMdxFile(filePath, parseEssayFrontmatter);
}
