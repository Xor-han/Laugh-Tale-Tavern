import db from "@/lib/db";
import type { CreateCommentDto, UpdateCommentDto } from "@/dtos/comment.dto";

export const getAllComment = async () => {
  return db.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getCommentById = async (id: string) => {
  const comment = db.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });
  if(!comment){
    return null
  }
  return comment
};

export const createComment = async (data: CreateCommentDto, userId: string) => {
  return await db.comment.create({
    data: {
      content: data.content,
      authorId: userId,
      onePieceCharacterId: data.onePieceCharacterId,
      devilFruitId: data.devilFruitId,
      arcId: data.arcId,
      organisationId: data.organisationId,
      equipageId: data.equipageId,
    },
  });
};

export const updateComment = async (id: string, userId: string, data: UpdateCommentDto) => {
    const existing = await db.comment.findUnique({where : {id}});
    if(!existing || existing.authorId !== userId) return null;

  return db.comment.update({
    where: { id },
    data: {
      content: data.content,
    },
  });
};


export const deleteComment = async (id: string, userId : string) => {
    const existing = await db.comment.findUnique({where : {id}});
    if(!existing || existing.authorId !== userId) return null;
    
    await db.comment.delete({where : {id}});
    return true;
}
