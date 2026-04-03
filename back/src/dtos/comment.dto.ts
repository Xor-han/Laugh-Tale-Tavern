import { z } from "zod/v4";

export const createCommentShema = z.object({
content: z.string().min(1, "Le commentaire doit contenir au moins 1 caractère"),
  onePieceCharacterId: z.number().int().optional(),
  devilFruitId: z.number().int().optional(),
  arcId:  z.number().int().optional(),
  organisationId: z.number().int().optional(),
  crewId: z.number().int().optional(),
  parentId: z.string().optional().nullable(),
});
export const updateCommentShema = z.object({
content: z.string().min(1),
  onePieceCharacterId: z.number().int().optional(),
  devilFruitId: z.number().int().optional(),
  arcId:  z.number().int().optional(),
  organisationId: z.number().int().optional(),
  crewId: z.number().int().optional(),
  parentId: z.string().optional().nullable(),
});
export const patchCommentShema = z.object({
content: z.string().min(1),
  onePieceCharacterId: z.number().int().optional(),
  devilFruitId: z.number().int().optional(),
  arcId:  z.number().int().optional(),
  organisationId: z.number().int().optional(),
  crewId: z.number().int().optional(),
  parentId: z.string().optional().nullable(),
});

export type CreateCommentDto = z.infer<typeof createCommentShema>;
export type UpdateCommentDto = z.infer<typeof updateCommentShema>;
export type PatchCommentDto = z.infer<typeof patchCommentShema>;
