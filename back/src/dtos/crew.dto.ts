import { z } from "zod/v4";
export const createCrewShema = z.object({
  name: z
    .string()
    .min(1, "le nom de l'équipage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  slug: z.string().optional(),
  imageId: z.number().int().positive().nullable().optional(),
});
export const updateCrewShema = z.object({
  name: z
    .string()
    .min(1, "le nom de l'équipage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
});
export const patchCrewShema = z.object({
  name: z
    .string()
    .min(1, "le nom de l'équipage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
});

export type CreateCrewDto = z.infer<typeof createCrewShema>;
export type UpdateCrewDto = z.infer<typeof updateCrewShema>;
export type PatchCrewDto = z.infer<typeof patchCrewShema>;
