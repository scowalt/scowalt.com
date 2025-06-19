import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  output: process.env.NODE_ENV === 'production' ? 'server' : 'static',
  adapter: process.env.NODE_ENV === 'production' ? cloudflare({
    runtime: {
      mode: 'node',
    },
    imageService: 'compile',
  }) : undefined,
  integrations: [tailwind(), icon()]
});