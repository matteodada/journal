import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/thoughts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    date_label: z.string(),
  }),
});

const adventures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/adventures' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    date_label: z.string(),
    cover: z.string(),
  }),
});

export const collections = { thoughts, adventures };
