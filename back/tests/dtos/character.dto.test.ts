import {
  createCharacterShema,
  updateCharacterShema,
  patchCharacterShema,
} from "@/dtos/character.dto";

describe("createCharacterShema", () => {
  it("accepte des données valides", () => {
    const result = createCharacterShema.safeParse({
      name: "Luffy",
      content: "Capitaine des Mugiwara",
      profession: "capitaine",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = createCharacterShema.safeParse({
      content: "Contenu",
      profession: "capitaine",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu est manquant", () => {
    const result = createCharacterShema.safeParse({
      name: "Luffy",
      profession: "capitaine",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le nom dépasse 50 caractères", () => {
    const result = createCharacterShema.safeParse({
      name: "a".repeat(51),
      content: "Contenu",
      profession: "capitaine",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu dépasse 500 caractères", () => {
    const result = createCharacterShema.safeParse({
      name: "Luffy",
      content: "a".repeat(501),
      profession: "capitaine",
    });
    expect(result.success).toBe(false);
  });

  it("accepte des champs optionnels (isAlive, imageId, devilFruitId)", () => {
    const result = createCharacterShema.safeParse({
      name: "Luffy",
      content: "Capitaine",
      profession: "capitaine",
      isAlive: true,
      imageId: 1,
      devilFruitId: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateCharacterShema", () => {
  it("accepte des données valides", () => {
    const result = updateCharacterShema.safeParse({
      name: "Luffy",
      content: "Contenu mis à jour",
      profession: "capitaine",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = updateCharacterShema.safeParse({
      content: "Contenu",
      profession: "capitaine",
    });
    expect(result.success).toBe(false);
  });

  it("accepte un contenu jusqu'à 800 caractères", () => {
    const result = updateCharacterShema.safeParse({
      name: "Luffy",
      content: "a".repeat(800),
      profession: "capitaine",
    });
    expect(result.success).toBe(true);
  });
});

describe("patchCharacterShema", () => {
  it("accepte des données valides", () => {
    const result = patchCharacterShema.safeParse({
      name: "Luffy",
      content: "Contenu",
      profession: "capitaine",
    });
    expect(result.success).toBe(true);
  });

  it("accepte des champs optionnels", () => {
    const result = patchCharacterShema.safeParse({
      name: "Luffy",
      content: "Contenu",
      profession: "capitaine",
      arcIds: [1, 2, 3],
    });
    expect(result.success).toBe(true);
  });
});
