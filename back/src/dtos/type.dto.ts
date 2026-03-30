import { z } from "zod/v4";
export const createTypeShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères")
});
export const updateTypeShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères")
});

export type CreateTypeDto = z.infer<typeof createTypeShema>;
export type UpdateTypeDto = z.infer<typeof updateTypeShema>;
