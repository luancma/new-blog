// @ts-check
import { defineConfig } from "astro/config";
import sitemap from '@astrojs/sitemap';
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: 'https://vozdotrabalhador.com',
  build: {
    format: "file",
  },

  integrations: [sitemap(), robotsTxt()],
});