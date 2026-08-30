import { defineConfig, sessionDrivers } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { unified } from '@astrojs/markdown-remark';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  session: {
    driver: sessionDrivers.null(),
  },
  integrations: [icon(), mdx()],
  security: {
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'font-src': ["'self'"],
      },
    },
  },
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            properties: {
              class: 'header-anchor',
              'aria-label': 'Link to this section',
              title: 'Link to this section',
            },
            content: [
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  class: 'anchor-icon',
                  viewBox: '0 0 24 24',
                  'aria-hidden': 'true',
                  focusable: 'false',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'path',
                    properties: {
                      fill: 'currentColor',
                      d: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5',
                    },
                  },
                ],
              },
            ],
          },
        ],
      ],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
