// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Replace with the team's domain before deploying.
  site: 'https://olvt.org',
  build: {
    // Keep each page self-contained: no separate CSS files to cache-bust.
    inlineStylesheets: 'always',
  },
});
