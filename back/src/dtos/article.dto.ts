import { z } from "zod/v4";

export const getArticlesQuerySchema = z.object({
  type: z
    .enum(["characters", "devilFruits", "arcs", "crews", "organisations"])
    .optional(),
  search: z.string().max(100).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export type GetArticlesQuery = z.infer<typeof getArticlesQuerySchema>;
