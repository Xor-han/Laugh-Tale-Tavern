import { z } from "zod/v4";
export const createCharacterShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  isAlive: z.boolean().optional(),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  profession: z.string().min(1).max(50),
  imageId: z.number().int().positive().nullable().optional(),
  devilFruit_id: z.number().int().positive().nullable().optional(),
  organisationId: z.number().int().positive().nullable().optional(),
  equipageId: z.number().int().positive().nullable().optional(),
  arcIds: z.array(z.number()).optional(),
});
export const updateCharacterShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  isAlive: z.boolean().optional(),
  profession: z.string().min(1).max(50),
  imageId: z.number().int().positive().nullable().optional(),
  devilFruit_id: z.number().int().positive().nullable().optional(),
  organisationId: z.number().int().positive().nullable().optional(),
  equipageId: z.number().int().positive().nullable().optional(),
  arcIds: z.array(z.number()).optional(),
});
export const patchCharacterShema = z.object({
  name: z
    .string()
    .min(1, "le nom du personnage est obligatoire")
    .max(50, "le nom doit contenir un maximum de 50 caractères"),
  content: z
    .string()
    .min(1, "Le contenu est obligatoire")
    .max(500, "le contenu doit contenir maximum 500 caractères"),
  isAlive: z.boolean().optional(),
  profession: z.string().min(1).max(50),
  imageId: z.number().int().positive().nullable().optional(),
  devilFruit_id: z.number().int().positive().nullable().optional(),
  organisationId: z.number().int().positive().nullable().optional(),
  equipageId: z.number().int().positive().nullable().optional(),
  arcIds: z.array(z.number()).optional(),
});

export type CreateCharacterDto = z.infer<typeof createCharacterShema>;
export type UpdateCharacterDto = z.infer<typeof updateCharacterShema>;
export type PatchCharacterDto = z.infer<typeof patchCharacterShema>;
