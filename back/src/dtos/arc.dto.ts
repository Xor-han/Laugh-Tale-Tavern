import { z } from "zod/v4";
export const createArcShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
});
export const updateArcShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
});
export const patchArcShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
});

export type CreateArcrDto = z.infer<typeof createArcShema>;
export type UpdateArcDto = z.infer<typeof updateArcShema>;
export type PatchArcDto = z.infer<typeof patchArcShema>;
