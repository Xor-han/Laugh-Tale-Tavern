import { z } from "zod/v4";
export const createDevilFruitShema = z.object({
  name: z
    .string()
    .min(1, "le nom du fruit est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  slug: z.string().optional(),
  imageId: z.number().int().positive().nullable().optional(),
  typeId: z.number().int().positive().nullable().optional(),
});
export const updateDevilFruitShema = z.object({
  name: z
    .string()
    .min(1, "le nom du fruit est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
  typeId: z.number().int().positive().nullable().optional(),
});
export const patchDevilFruitShema = z.object({
  name: z
    .string()
    .min(1, "le nom du fruit est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
  typeId: z.number().int().positive().nullable().optional(),
});

export type CreateDevilFruitDto = z.infer<typeof createDevilFruitShema>;
export type UpdateDevilFruitDto = z.infer<typeof updateDevilFruitShema>;
export type PatchDevilFruitDto = z.infer<typeof patchDevilFruitShema>;
