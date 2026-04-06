import {
  createDevilFruitShema,
  updateDevilFruitShema,
  patchDevilFruitShema,
} from "@/dtos/devilFruit.dto";

describe("createDevilFruitShema", () => {
  it("accepte des données valides", () => {
    const result = createDevilFruitShema.safeParse({
      name: "Gomu Gomu no Mi",
      content: "Fruit du caoutchouc",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = createDevilFruitShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu est manquant", () => {
    const result = createDevilFruitShema.safeParse({
      name: "Gomu Gomu no Mi",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le nom dépasse 50 caractères", () => {
    const result = createDevilFruitShema.safeParse({
      name: "a".repeat(51),
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le contenu dépasse 500 caractères", () => {
    const result = createDevilFruitShema.safeParse({
      name: "Gomu Gomu no Mi",
      content: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepte un typeId optionnel", () => {
    const result = createDevilFruitShema.safeParse({
      name: "Gomu Gomu no Mi",
      content: "Contenu",
      typeId: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateDevilFruitShema", () => {
  it("accepte des données valides", () => {
    const result = updateDevilFruitShema.safeParse({
      name: "Gomu Gomu no Mi",
      content: "Contenu mis à jour",
    });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = updateDevilFruitShema.safeParse({
      content: "Contenu",
    });
    expect(result.success).toBe(false);
  });
});

describe("patchDevilFruitShema", () => {
  it("accepte des données valides", () => {
    const result = patchDevilFruitShema.safeParse({
      name: "Gomu Gomu no Mi",
      content: "Contenu",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un typeId nullable", () => {
    const result = patchDevilFruitShema.safeParse({
      name: "Gomu Gomu no Mi",
      content: "Contenu",
      typeId: null,
    });
    expect(result.success).toBe(true);
  });
});
