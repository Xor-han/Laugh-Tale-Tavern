import {
  createCommentShema,
  updateCommentShema,
} from "@/dtos/comment.dto";

describe("createCommentShema", () => {
  it("accepte des données valides", () => {
    const result = createCommentShema.safeParse({
      content: "Super personnage !",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le contenu est vide", () => {
    const result = createCommentShema.safeParse({
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu est manquant", () => {
    const result = createCommentShema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepte un onePieceCharacterId optionnel", () => {
    const result = createCommentShema.safeParse({
      content: "Commentaire",
      onePieceCharacterId: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepte un parentId nullable", () => {
    const result = createCommentShema.safeParse({
      content: "Réponse",
      parentId: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepte un parentId string (pour les réponses)", () => {
    const result = createCommentShema.safeParse({
      content: "Réponse",
      parentId: "comment-id-123",
    });
    expect(result.success).toBe(true);
  });
});

describe("updateCommentShema", () => {
  it("accepte des données valides", () => {
    const result = updateCommentShema.safeParse({
      content: "Commentaire modifié",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le contenu est vide", () => {
    const result = updateCommentShema.safeParse({
      content: "",
    });
    expect(result.success).toBe(false);
  });
});
