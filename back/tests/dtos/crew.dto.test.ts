import {
  createCrewShema,
  updateCrewShema,
  patchCrewShema,
} from "@/dtos/crew.dto";

describe("createCrewShema", () => {
  it("accepte des données valides", () => {
    const result = createCrewShema.safeParse({
      name: "Mugiwara",
      content: "L'équipage du Chapeau de Paille",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = createCrewShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu est manquant", () => {
    const result = createCrewShema.safeParse({
      name: "Mugiwara",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le nom dépasse 50 caractères", () => {
    const result = createCrewShema.safeParse({
      name: "a".repeat(51),
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu dépasse 500 caractères", () => {
    const result = createCrewShema.safeParse({
      name: "Mugiwara",
      content: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepte un imageId optionnel", () => {
    const result = createCrewShema.safeParse({
      name: "Mugiwara",
      content: "Contenu",
      imageId: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateCrewShema", () => {
  it("accepte des données valides", () => {
    const result = updateCrewShema.safeParse({
      name: "Mugiwara",
      content: "Contenu mis à jour",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = updateCrewShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });
});

describe("patchCrewShema", () => {
  it("accepte des données valides", () => {
    const result = patchCrewShema.safeParse({
      name: "Mugiwara",
      content: "Contenu",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un imageId nullable", () => {
    const result = patchCrewShema.safeParse({
      name: "Mugiwara",
      content: "Contenu",
      imageId: null,
    });
    expect(result.success).toBe(true);
  });
});
