import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./data/blog/uploads", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    authorDescription: z.string(),
    primaryTag: z.string(),
    tags: z.array(z.string()),
    createdAt: z.string(),
    // Optional fields
    updatedAt: z.string().optional(),
    cover: z.string().optional(),
    authorAvatar: z.string().optional(),
    references: z.array(z.string()).optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    email: z.string().optional(),
  }),
});

export const collections = { blog };
