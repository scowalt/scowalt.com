import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    screenshot: z.string(),
    techStack: z.array(z.string()),
    url: z.url().optional(),
    repo: z.url().optional(),
    order: z.number(),
  }),
});

const bbPlugins = defineCollection({
  loader: file('./src/content/bb-plugins.json'),
  schema: z.object({
    name: z.string(),
    group: z.enum(['built', 'fork']),
    order: z.number(),
    description: z.string(),
    repo: z.url(),
    forkOf: z.object({ name: z.string(), url: z.url() }).optional(),
  }),
});

export const collections = { projects, bbPlugins };
