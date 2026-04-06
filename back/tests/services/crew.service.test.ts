vi.mock("@/lib/db", () => ({
  default: {
    crews: {
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
import * as crewService from "@/services/crew.service";

const mockDb = db as unknown as {
  crews: {
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

describe("crewService.getAllCrew", () => {
  it("retourne tous les équipages", async () => {
    const fakeCrews = [{ id: 1, name: "Mugiwara" }];
    mockDb.crews.findMany.mockResolvedValue(fakeCrews);

    const result = await crewService.getAllCrew();

    expect(result).toEqual(fakeCrews);
    expect(mockDb.crews.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("crewService.getCrewById", () => {
  it("retourne l'équipage si il existe", async () => {
    const fakeCrew = { id: 1, name: "Mugiwara" };
    mockDb.crews.findUnique.mockResolvedValue(fakeCrew);

    const result = await crewService.getCrewById(1);

    expect(result).toEqual(fakeCrew);
  });

  it("retourne null si l'équipage n'existe pas", async () => {
    mockDb.crews.findUnique.mockResolvedValue(null);

    const result = await crewService.getCrewById(999);

    expect(result).toBeNull();
  });
});

describe("crewService.getCrewBySlug", () => {
  it("retourne l'équipage par slug", async () => {
    const fakeCrew = { id: 1, name: "Mugiwara", slug: "mugiwara" };
    mockDb.crews.findUnique.mockResolvedValue(fakeCrew);

    const result = await crewService.getCrewBySlug("mugiwara");

    expect(result).toEqual(fakeCrew);
  });

  it("retourne null si le slug n'existe pas", async () => {
    mockDb.crews.findUnique.mockResolvedValue(null);

    const result = await crewService.getCrewBySlug("inconnu");

    expect(result).toBeNull();
  });
});

describe("crewService.createCrew", () => {
  it("crée un équipage avec les données fournies", async () => {
    const fakeCreated = { id: 1, name: "Mugiwara", slug: "mugiwara" };
    mockDb.crews.create.mockResolvedValue(fakeCreated);

    const result = await crewService.createCrew({
      name: "Mugiwara",
      content: "L'équipage du Chapeau de Paille",
      imageId: 1,
    });

    expect(result).toEqual(fakeCreated);
    expect(mockDb.crews.create).toHaveBeenCalledTimes(1);
  });
});

describe("crewService.updateCrew", () => {
  it("met à jour si l'équipage existe", async () => {
    mockDb.crews.findUnique.mockResolvedValue({ id: 1 });
    const fakeUpdated = { id: 1, name: "Mugiwara Updated" };
    mockDb.crews.update.mockResolvedValue(fakeUpdated);

    const result = await crewService.updateCrew(1, {
      name: "Mugiwara Updated",
      content: "Contenu mis à jour",
    });

    expect(result).toEqual(fakeUpdated);
  });

  it("retourne null si l'équipage n'existe pas", async () => {
    mockDb.crews.findUnique.mockResolvedValue(null);

    const result = await crewService.updateCrew(999, {
      name: "Test",
      content: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("crewService.PatchCrew", () => {
  it("modifie partiellement si l'équipage existe", async () => {
    mockDb.crews.findUnique.mockResolvedValue({ id: 1 });
    const fakePatched = { id: 1, name: "Mugiwara Patched" };
    mockDb.crews.update.mockResolvedValue(fakePatched);

    const result = await crewService.PatchCrew(1, {
      name: "Mugiwara Patched",
      imageId: 1,
    } as any);

    expect(result).toEqual(fakePatched);
  });

  it("retourne null si l'équipage n'existe pas", async () => {
    mockDb.crews.findUnique.mockResolvedValue(null);

    const result = await crewService.PatchCrew(999, {
      name: "Test",
    } as any);

    expect(result).toBeNull();
  });
});

describe("crewService.deleteCrew", () => {
  it("supprime l'équipage et retourne true", async () => {
    mockDb.crews.findUnique.mockResolvedValue({ id: 1, image: [] });
    mockDb.crews.delete.mockResolvedValue({});

    const result = await crewService.deleteCrew(1);

    expect(result).toBe(true);
    expect(mockDb.crews.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("supprime aussi l'image Cloudinary si elle existe", async () => {
    mockDb.crews.findUnique.mockResolvedValue({
      id: 1,
      image: [{ id: 10, publicId: "img_crew" }],
    });
    mockCloudinary.uploader.destroy.mockResolvedValue({});
    mockDb.image.delete.mockResolvedValue({});
    mockDb.crews.delete.mockResolvedValue({});

    const result = await crewService.deleteCrew(1);

    expect(result).toBe(true);
    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith("img_crew");
  });

  it("retourne null si l'équipage n'existe pas", async () => {
    mockDb.crews.findUnique.mockResolvedValue(null);

    const result = await crewService.deleteCrew(999);

    expect(result).toBeNull();
  });
});
