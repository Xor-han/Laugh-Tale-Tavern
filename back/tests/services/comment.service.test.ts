vi.mock("@/lib/db", () => ({
  default: {
    comment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import db from "@/lib/db";
import * as commentService from "@/services/comment.service";

const mockDb = db as unknown as {
  comment: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("commentService.getAllComment", () => {
  it("retourne tous les commentaires", async () => {
    const fakeComments = [{ id: "c1", content: "Super !" }];
    mockDb.comment.findMany.mockResolvedValue(fakeComments);

    const result = await commentService.getAllComment();

    expect(result).toEqual(fakeComments);
    expect(mockDb.comment.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("commentService.getCommentById", () => {
  it("retourne le commentaire si il existe", async () => {
    const fakeComment = { id: "c1", content: "Super !" };
    mockDb.comment.findUnique.mockResolvedValue(fakeComment);

    const result = await commentService.getCommentById("c1");

    expect(result).toEqual(fakeComment);
  });
});

describe("commentService.createComment", () => {
  it("crée un commentaire avec les données fournies", async () => {
    const fakeCreated = { id: "c1", content: "Mon commentaire", authorId: "user-1" };
    mockDb.comment.create.mockResolvedValue(fakeCreated);

    const result = await commentService.createComment(
      { content: "Mon commentaire" },
      "user-1",
    );

    expect(result).toEqual(fakeCreated);
    expect(mockDb.comment.create).toHaveBeenCalledTimes(1);
  });
});

describe("commentService.updateComment", () => {
  it("met à jour si le commentaire appartient à l'utilisateur", async () => {
    mockDb.comment.findUnique.mockResolvedValue({ id: "c1", authorId: "user-1" });
    const fakeUpdated = { id: "c1", content: "Modifié" };
    mockDb.comment.update.mockResolvedValue(fakeUpdated);

    const result = await commentService.updateComment("c1", "user-1", {
      content: "Modifié",
    });

    expect(result).toEqual(fakeUpdated);
  });

  it("retourne null si le commentaire appartient à un autre utilisateur", async () => {
    mockDb.comment.findUnique.mockResolvedValue({ id: "c1", authorId: "user-2" });

    const result = await commentService.updateComment("c1", "user-1", {
      content: "Modifié",
    });

    expect(result).toBeNull();
  });

  it("retourne null si le commentaire n'existe pas", async () => {
    mockDb.comment.findUnique.mockResolvedValue(null);

    const result = await commentService.updateComment("c999", "user-1", {
      content: "Modifié",
    });

    expect(result).toBeNull();
  });
});

describe("commentService.deleteComment", () => {
  it("supprime et retourne true si le commentaire appartient à l'utilisateur", async () => {
    mockDb.comment.findUnique.mockResolvedValue({ id: "c1", authorId: "user-1" });
    mockDb.comment.delete.mockResolvedValue({});

    const result = await commentService.deleteComment("c1", "user-1");

    expect(result).toBe(true);
    expect(mockDb.comment.delete).toHaveBeenCalledWith({ where: { id: "c1" } });
  });

  it("retourne null si le commentaire appartient à un autre utilisateur", async () => {
    mockDb.comment.findUnique.mockResolvedValue({ id: "c1", authorId: "user-2" });

    const result = await commentService.deleteComment("c1", "user-1");

    expect(result).toBeNull();
  });

  it("retourne null si le commentaire n'existe pas", async () => {
    mockDb.comment.findUnique.mockResolvedValue(null);

    const result = await commentService.deleteComment("c999", "user-1");

    expect(result).toBeNull();
  });
});
