import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(['design', 'personal', 'visual', 'books']),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    rating: z.number().min(1).max(10),
    amazonUrl: z.string().url(),
    coverImage: z.string(),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    description: z.string(),
    coverImage: z.string(),
    tags: z.array(z.string()).optional(),
    order: z.number().optional(),
  }),
});

const toolkit = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(z.object({
      name: z.string(),
      category: z.enum(['books', 'health', 'design', 'drawing', 'writing', 'tech']),
      description: z.string(),
      url: z.string().url(),
      image: z.string(),
      reviewUrl: z.string().optional(),
    })),
  }),
});

export const collections = {
  articles,
  notes,
  projects,
  toolkit,
};
