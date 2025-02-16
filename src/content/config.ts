import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./data/blog", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    authorDescription: z.string(),
    tags: z.array(z.string()),
    primaryTag: z.string(),
    createdAt: z.string(),
    authorAvatar: z.string().optional(),
    references: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
