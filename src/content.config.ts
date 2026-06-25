import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Proofs = bilingual case studies. Each proof lives at
// content/work/<slug>/{en,fr}.mdx and is validated on build.
// Adding a proof is now: drop a folder + two MDX files. The schema
// guarantees every required field is present and typed.
const work = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "content/work" }),
  schema: z.object({
    title: z.string(),
    titleFr: z.string().optional(),
    summary: z.string(),
    summaryFr: z.string().optional(),
    role: z.string(),
    domain: z.string(),
    stack: z.array(z.string()).default([]),
    date: z.string(),
    featured: z.boolean().default(false),
    confidential: z.boolean().default(false),
    status: z.enum(["active", "shipped", "archived", "draft"]).default("active"),
    period: z.string().optional(),
    proofClaim: z.string().optional(),
    outcome: z.string().optional(),
    // Surfaces = the shippable products behind a case study. Rendered as a
    // proof-first grid (live link + demo video) above the long-form prose.
    surfaces: z
      .array(
        z.object({
          name: z.string(),
          nameFr: z.string().optional(),
          blurb: z.string(),
          blurbFr: z.string().optional(),
          status: z.string(),
          statusFr: z.string().optional(),
          url: z.string().optional(),
          urlLabel: z.string().optional(),
          urlLabelFr: z.string().optional(),
          video: z.string().optional(),
          poster: z.string().optional(),
          stack: z.array(z.string()).default([]),
        }),
      )
      .default([]),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "content/writing" }),
  schema: z.object({
    title: z.string(),
    titleFr: z.string().optional(),
    summary: z.string(),
    summaryFr: z.string().optional(),
    date: z.string(),
    relatedCaseSlug: z.string().optional(),
  }),
});

export const collections = { work, writing };
