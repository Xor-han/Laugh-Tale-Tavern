import {
  createOrganisationShema,
  updateOrganisationShema,
  patchOrganisationShema,
} from "@/dtos/organisation.dto";

describe("createOrganisationShema", () => {
  it("accepte des données valides", () => {
    const result = createOrganisationShema.safeParse({
      name: "Marine",
      content: "La Marine du Gouvernement Mondial",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = createOrganisationShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu est manquant", () => {
    const result = createOrganisationShema.safeParse({
      name: "Marine",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le nom dépasse 50 caractères", () => {
    const result = createOrganisationShema.safeParse({
      name: "a".repeat(51),
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu dépasse 500 caractères", () => {
    const result = createOrganisationShema.safeParse({
      name: "Marine",
      content: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepte un imageId optionnel", () => {
    const result = createOrganisationShema.safeParse({
      name: "Marine",
      content: "Contenu",
      imageId: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateOrganisationShema", () => {
  it("accepte des données valides", () => {
    const result = updateOrganisationShema.safeParse({
      name: "Marine",
      content: "Contenu mis à jour",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = updateOrganisationShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });
});

describe("patchOrganisationShema", () => {
  it("accepte des données valides", () => {
    const result = patchOrganisationShema.safeParse({
      name: "Marine",
      content: "Contenu",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un imageId nullable", () => {
    const result = patchOrganisationShema.safeParse({
      name: "Marine",
      content: "Contenu",
      imageId: null,
    });
    expect(result.success).toBe(true);
  });
});
