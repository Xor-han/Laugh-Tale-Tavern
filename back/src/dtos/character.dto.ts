import {z} from "zod/v4";

export const createCharacterShema = z.object({
    name: z.string().min(1, "le nom du personnage est obligatoire").max(50, "le nom doit contenir un maximum de 50 caractères"),
    isAlive: z.boolean().optional(),
    profession: z.string().min(1, "La profession du personnage est obligatoire").max(50),
    imageId: z.number().int().positive().nullable().optional(),
    devilFruit_id: z.number().int().positive().nullable().optional(),
    organisationId: z.number().int().positive().nullable().optional(),
    equipageId: z.number().int().positive().nullable().optional(),
    arcIds: z.number().int().positive().nullable().array().optional(),

})
export const updateCharacterShema = z.object({
    name: z.string().min(1, "le nom du personnage est obligatoire").max(50, "le nom doit contenir un maximum de 50 caractères"),
    isAlive: z.boolean().optional(),
    profession: z.string().min(1, "La profession du personnage est obligatoire").max(50),
    imageId: z.number().int().positive().nullable().optional(),
    devilFruit_id: z.number().int().positive().nullable().optional(),
    organisationId: z.number().int().positive().nullable().optional(),
    equipageId: z.number().int().positive().nullable().optional(),
    arcIds: z.number().int().positive().nullable().array().optional(),

})
export const patchCharacterShema = z.object({
    name: z.string().min(1, "le nom du personnage est obligatoire").max(50, "le nom doit contenir un maximum de 50 caractères"),
    isAlive: z.boolean().optional(),
    profession: z.string().min(1, "La profession du personnage est obligatoire").max(50),
    imageId: z.number().int().positive().nullable().optional(),
    devilFruit_id: z.number().int().positive().nullable().optional(),
    organisationId: z.number().int().positive().nullable().optional(),
    equipageId: z.number().int().positive().nullable().optional(),
    arcIds: z.number().int().positive().nullable().array().optional(),

})

export type CreateCharacterDto = z.infer<typeof createCharacterShema>;
export type UpdateCharacterDto = z.infer<typeof updateCharacterShema>;
export type PatchCharacterDto = z.infer<typeof patchCharacterShema>;

