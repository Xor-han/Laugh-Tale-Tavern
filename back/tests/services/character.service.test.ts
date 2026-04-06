vi.mock("@/lib/db", () => ({
  default: {
    onePieceCharacter: {
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
import * as characterService from "@/services/character.service";

const mockDb = db as unknown as {
  onePieceCharacter: {
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

describe("characterService.getAllCharacter", () => {
  it("retourne tous les personnages", async () => {
    const fakeCharacters = [{ id: 1, name: "Luffy" }];
    mockDb.onePieceCharacter.findMany.mockResolvedValue(fakeCharacters);

    const result = await characterService.getAllCharacter();

    expect(result).toEqual(fakeCharacters);
    expect(mockDb.onePieceCharacter.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("characterService.getCharacterById", () => {
  it("retourne le personnage si il existe", async () => {
    const fakeCharacter = { id: 1, name: "Luffy" };
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(fakeCharacter);

    const result = await characterService.getCharacterById(1);

    expect(result).toEqual(fakeCharacter);
  });

  it("retourne null si le personnage n'existe pas", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const result = await characterService.getCharacterById(999);

    expect(result).toBeNull();
  });
});

describe("characterService.getCharacterBySlug", () => {
  it("retourne le personnage par slug", async () => {
    const fakeCharacter = { id: 1, name: "Luffy", slug: "luffy" };
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(fakeCharacter);

    const result = await characterService.getCharacterBySlug("luffy");

    expect(result).toEqual(fakeCharacter);
  });

  it("retourne null si le slug n'existe pas", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const result = await characterService.getCharacterBySlug("inconnu");

    expect(result).toBeNull();
  });
});

describe("characterService.createCharacter", () => {
  it("crée un personnage avec les données fournies", async () => {
    const fakeCreated = { id: 1, name: "Luffy", slug: "luffy" };
    mockDb.onePieceCharacter.create.mockResolvedValue(fakeCreated);

    const result = await characterService.createCharacter({
      name: "Luffy",
      content: "Capitaine des Mugiwara",
      profession: "capitaine",
    } as any);

    expect(result).toEqual(fakeCreated);
    expect(mockDb.onePieceCharacter.create).toHaveBeenCalledTimes(1);
  });
});

describe("characterService.updateCharacter", () => {
  it("met à jour si le personnage existe", async () => {
    const fakeExisting = { id: 1, name: "Luffy" };
    const fakeUpdated = { id: 1, name: "Luffy Updated" };
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(fakeExisting);
    mockDb.onePieceCharacter.update.mockResolvedValue(fakeUpdated);

    const result = await characterService.updateCharacter(1, {
      name: "Luffy Updated",
      content: "Contenu",
      profession: "capitaine",
    } as any);

    expect(result).toEqual(fakeUpdated);
  });

  it("retourne null si le personnage n'existe pas", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const result = await characterService.updateCharacter(999, {
      name: "Test",
      content: "Test",
      profession: "capitaine",
    } as any);

    expect(result).toBeNull();
  });
});

describe("characterService.patchCharacter", () => {
  it("modifie partiellement si le personnage existe", async () => {
    const fakeExisting = { id: 1, name: "Luffy" };
    const fakePatched = { id: 1, name: "Luffy Patched" };
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(fakeExisting);
    mockDb.onePieceCharacter.update.mockResolvedValue(fakePatched);

    const result = await characterService.patchCharacter(1, {
      name: "Luffy Patched",
    } as any);

    expect(result).toEqual(fakePatched);
  });

  it("retourne null si le personnage n'existe pas", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const result = await characterService.patchCharacter(999, {
      name: "Test",
    } as any);

    expect(result).toBeNull();
  });
});

describe("characterService.deleteCharacter", () => {
  it("supprime le personnage et retourne true", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue({
      id: 1,
      name: "Luffy",
      image: [],
    });
    mockDb.onePieceCharacter.delete.mockResolvedValue({});

    const result = await characterService.deleteCharacter(1);

    expect(result).toBe(true);
    expect(mockDb.onePieceCharacter.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("supprime aussi l'image Cloudinary si elle existe", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue({
      id: 1,
      name: "Luffy",
      image: [{ id: 10, publicId: "img_123" }],
    });
    mockCloudinary.uploader.destroy.mockResolvedValue({});
    mockDb.image.delete.mockResolvedValue({});
    mockDb.onePieceCharacter.delete.mockResolvedValue({});

    const result = await characterService.deleteCharacter(1);

    expect(result).toBe(true);
    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith("img_123");
    expect(mockDb.image.delete).toHaveBeenCalledWith({ where: { id: 10 } });
  });

  it("retourne null si le personnage n'existe pas", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const result = await characterService.deleteCharacter(999);

    expect(result).toBeNull();
  });
});
