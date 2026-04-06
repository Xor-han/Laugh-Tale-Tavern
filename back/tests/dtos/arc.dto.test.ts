import {
  createArcShema,
  updateArcShema,
  patchArcShema,
} from "@/dtos/arc.dto";

describe("createArcShema", () => {
  it("accepte des données valides", () => {
    const result = createArcShema.safeParse({
      name: "East Blue",
      content: "Le premier arc",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = createArcShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu est manquant", () => {
    const result = createArcShema.safeParse({
      name: "East Blue",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le nom dépasse 50 caractères", () => {
    const result = createArcShema.safeParse({
      name: "a".repeat(51),
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu dépasse 500 caractères", () => {
    const result = createArcShema.safeParse({
      name: "East Blue",
      content: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepte un imageId optionnel", () => {
    const result = createArcShema.safeParse({
      name: "East Blue",
      content: "Contenu",
      imageId: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateArcShema", () => {
  it("accepte des données valides", () => {
    const result = updateArcShema.safeParse({
      name: "East Blue",
      content: "Contenu mis à jour",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = updateArcShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });
});

describe("patchArcShema", () => {
  it("accepte des données valides", () => {
    const result = patchArcShema.safeParse({
      name: "Wano",
      content: "Contenu",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un imageId nullable", () => {
    const result = patchArcShema.safeParse({
      name: "Wano",
      content: "Contenu",
      imageId: null,
    });
    expect(result.success).toBe(true);
  });
});
