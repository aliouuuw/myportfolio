// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://aliouwade.com",
  // Static pages by default; routes opt into server rendering via
  // `export const prerender = false` (e.g. the contact endpoint).
  output: "static",
  adapter: vercel(),
  integrations: [mdx()],
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
