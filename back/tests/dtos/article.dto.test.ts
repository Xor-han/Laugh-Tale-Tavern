import { getArticlesQuerySchema } from "@/dtos/article.dto";

describe("getArticlesQuerySchema", () => {
  it("accepte une requête vide", () => {
    const result = getArticlesQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepte un type valide", () => {
    const result = getArticlesQuerySchema.safeParse({ type: "characters" });
    expect(result.success).toBe(true);
  });

  it("accepte tous les types valides", () => {
    const types = ["characters", "devilFruits", "arcs", "crews", "organisations"];
    types.forEach((type) => {
      const result = getArticlesQuerySchema.safeParse({ type });
      expect(result.success).toBe(true);
    });
  });

  it("rejette un type invalide", () => {
    const result = getArticlesQuerySchema.safeParse({ type: "invalid" });
    expect(result.success).toBe(false);
  });

  it("accepte un order valide (asc/desc)", () => {
    expect(getArticlesQuerySchema.safeParse({ order: "asc" }).success).toBe(true);
    expect(getArticlesQuerySchema.safeParse({ order: "desc" }).success).toBe(true);
  });

  it("rejette un order invalide", () => {
    const result = getArticlesQuerySchema.safeParse({ order: "random" });
    expect(result.success).toBe(false);
  });

  it("accepte un search valide", () => {
    const result = getArticlesQuerySchema.safeParse({ search: "Luffy" });
    expect(result.success).toBe(true);
  });

  it("rejette un search de plus de 100 caractères", () => {
    const result = getArticlesQuerySchema.safeParse({ search: "a".repeat(101) });
    expect(result.success).toBe(false);
  });
});
