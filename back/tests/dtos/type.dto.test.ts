import {
  createTypeShema,
  updateTypeShema,
} from "@/dtos/type.dto";

describe("createTypeShema", () => {
  it("accepte des données valides", () => {
    const result = createTypeShema.safeParse({ name: "Paramecia" });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = createTypeShema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejette si le nom est vide", () => {
    const result = createTypeShema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejette si le nom dépasse 50 caractères", () => {
    const result = createTypeShema.safeParse({ name: "a".repeat(51) });
    expect(result.success).toBe(false);
  });
});

describe("updateTypeShema", () => {
  it("accepte des données valides", () => {
    const result = updateTypeShema.safeParse({ name: "Logia" });
    expect(result.success).toBe(true);
  });

  it("rejette si le nom est manquant", () => {
    const result = updateTypeShema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejette si le nom dépasse 50 caractères", () => {
    const result = updateTypeShema.safeParse({ name: "a".repeat(51) });
    expect(result.success).toBe(false);
  });
});
