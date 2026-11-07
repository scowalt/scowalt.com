import { defineConfig, sessionDrivers } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { satteri, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const headingAutolinksPlugin = {
  name: 'heading-autolinks',
  element: {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    visit(node, context) {
      const id = node.properties?.id;
      if (typeof id !== 'string') return;

      context.prependChild(node, {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${id}`,
          className: ['header-anchor'],
          ariaLabel: 'Link to this section',
          title: 'Link to this section',
        },
        children: [
          {
            type: 'element',
            tagName: 'svg',
            properties: {
              className: ['anchor-icon'],
              viewBox: '0 0 24 24',
              ariaHidden: 'true',
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
                children: [],
              },
            ],
          },
        ],
      });
    },
  },
};

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: { build: 'compile', runtime: 'passthrough' },
  }),
  session: {
    driver: sessionDrivers.null(),
  },
  integrations: [icon(), mdx()],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
      ],
    },
  },
  markdown: {
    processor: satteri({
      hastPlugins: [satteriHeadingIdsPlugin, headingAutolinksPlugin],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
