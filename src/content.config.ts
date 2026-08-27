import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    screenshot: z.string(),
    highlightHeading: z.string().optional(),
    techStack: z.array(z.string()),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number(),
  }),
});

export const collections = { projects };
