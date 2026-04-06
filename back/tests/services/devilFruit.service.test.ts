vi.mock("@/lib/db", () => ({
  default: {
    devilFruit: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    image: {
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/cloudinary", () => ({
  default: {
    uploader: {
      destroy: vi.fn(),
    },
  },
}));

vi.mock("@/utils/slugify", () => ({
  slugify: vi.fn((text: string) => text.toLowerCase().replace(/\s+/g, "-")),
}));

import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import * as devilFruitService from "@/services/devilFruit.service";

const mockDb = db as unknown as {
  devilFruit: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  image: {
    delete: ReturnType<typeof vi.fn>;
  };
};

const mockCloudinary = cloudinary as unknown as {
  uploader: { destroy: ReturnType<typeof vi.fn> };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("devilFruitService.getAllDevilFruit", () => {
  it("retourne tous les fruits du démon", async () => {
    const fakeFruits = [{ id: 1, name: "Gomu Gomu no Mi" }];
    mockDb.devilFruit.findMany.mockResolvedValue(fakeFruits);

    const result = await devilFruitService.getAllDevilFruit();

    expect(result).toEqual(fakeFruits);
    expect(mockDb.devilFruit.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("devilFruitService.getDevilFruitById", () => {
  it("retourne le fruit si il existe", async () => {
    const fakeFruit = { id: 1, name: "Gomu Gomu no Mi" };
    mockDb.devilFruit.findUnique.mockResolvedValue(fakeFruit);

    const result = await devilFruitService.getDevilFruitById(1);

    expect(result).toEqual(fakeFruit);
  });

  it("retourne null si le fruit n'existe pas", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue(null);

    const result = await devilFruitService.getDevilFruitById(999);

    expect(result).toBeNull();
  });
});

describe("devilFruitService.getDevilFruitBySlug", () => {
  it("retourne le fruit par slug", async () => {
    const fakeFruit = { id: 1, name: "Gomu Gomu no Mi", slug: "gomu-gomu-no-mi" };
    mockDb.devilFruit.findUnique.mockResolvedValue(fakeFruit);

    const result = await devilFruitService.getDevilFruitBySlug("gomu-gomu-no-mi");

    expect(result).toEqual(fakeFruit);
  });

  it("retourne null si le slug n'existe pas", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue(null);

    const result = await devilFruitService.getDevilFruitBySlug("inconnu");

    expect(result).toBeNull();
  });
});

describe("devilFruitService.createDevilFruit", () => {
  it("crée un fruit du démon avec les données fournies", async () => {
    const fakeCreated = { id: 1, name: "Gomu Gomu no Mi", slug: "gomu-gomu-no-mi" };
    mockDb.devilFruit.create.mockResolvedValue(fakeCreated);

    const result = await devilFruitService.createDevilFruit({
      name: "Gomu Gomu no Mi",
      content: "Fruit du caoutchouc",
    });

    expect(result).toEqual(fakeCreated);
    expect(mockDb.devilFruit.create).toHaveBeenCalledTimes(1);
  });
});

describe("devilFruitService.updateDevilFruit", () => {
  it("met à jour si le fruit existe", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue({ id: 1 });
    const fakeUpdated = { id: 1, name: "Gomu Gomu Updated" };
    mockDb.devilFruit.update.mockResolvedValue(fakeUpdated);

    const result = await devilFruitService.updateDevilFruit(1, {
      name: "Gomu Gomu Updated",
      content: "Contenu mis à jour",
    });

    expect(result).toEqual(fakeUpdated);
  });

  it("retourne null si le fruit n'existe pas", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue(null);

    const result = await devilFruitService.updateDevilFruit(999, {
      name: "Test",
      content: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("devilFruitService.PatchDevilFruit", () => {
  it("modifie partiellement si le fruit existe", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue({ id: 1 });
    const fakePatched = { id: 1, name: "Gomu Patched" };
    mockDb.devilFruit.update.mockResolvedValue(fakePatched);

    const result = await devilFruitService.PatchDevilFruit(1, {
      name: "Gomu Patched",
      content: "Contenu",
    });

    expect(result).toEqual(fakePatched);
  });

  it("retourne null si le fruit n'existe pas", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue(null);

    const result = await devilFruitService.PatchDevilFruit(999, {
      name: "Test",
      content: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("devilFruitService.deleteDevilFruit", () => {
  it("supprime le fruit et retourne true", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue({ id: 1, image: [] });
    mockDb.devilFruit.delete.mockResolvedValue({});

    const result = await devilFruitService.deleteDevilFruit(1);

    expect(result).toBe(true);
    expect(mockDb.devilFruit.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("supprime aussi l'image Cloudinary si elle existe", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue({
      id: 1,
      image: [{ id: 10, publicId: "img_fruit" }],
    });
    mockCloudinary.uploader.destroy.mockResolvedValue({});
    mockDb.image.delete.mockResolvedValue({});
    mockDb.devilFruit.delete.mockResolvedValue({});

    const result = await devilFruitService.deleteDevilFruit(1);

    expect(result).toBe(true);
    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith("img_fruit");
  });

  it("retourne null si le fruit n'existe pas", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue(null);

    const result = await devilFruitService.deleteDevilFruit(999);

    expect(result).toBeNull();
  });
});
