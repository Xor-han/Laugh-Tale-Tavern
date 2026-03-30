import { z } from "zod/v4";
export const createOrganisationShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  imageId: z.number().int().positive().nullable().optional(),
  slug: z.string().optional(),
});
export const updateOrganisationShema = z.object({
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
export const patchOrganisationShema = z.object({
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

export type CreateOrganisationDto = z.infer<typeof createOrganisationShema>;
export type UpdateOrganisationDto = z.infer<typeof updateOrganisationShema>;
export type PatchOrganisationDto = z.infer<typeof patchOrganisationShema>;
