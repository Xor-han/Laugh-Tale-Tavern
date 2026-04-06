vi.mock("@/lib/db", () => ({
  default: {
    arcs: {
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
import * as arcService from "@/services/arc.service";

const mockDb = db as unknown as {
  arcs: {
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

describe("arcService.getAllArc", () => {
  it("retourne tous les arcs", async () => {
    const fakeArcs = [{ id: 1, name: "East Blue" }];
    mockDb.arcs.findMany.mockResolvedValue(fakeArcs);

    const result = await arcService.getAllArc();

    expect(result).toEqual(fakeArcs);
    expect(mockDb.arcs.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("arcService.getArcById", () => {
  it("retourne l'arc si il existe", async () => {
    const fakeArc = { id: 1, name: "East Blue" };
    mockDb.arcs.findUnique.mockResolvedValue(fakeArc);

    const result = await arcService.getArcById(1);

    expect(result).toEqual(fakeArc);
  });

  it("retourne null si l'arc n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const result = await arcService.getArcById(999);

    expect(result).toBeNull();
  });
});

describe("arcService.getArcBySlug", () => {
  it("retourne l'arc par slug", async () => {
    const fakeArc = { id: 1, name: "East Blue", slug: "east-blue" };
    mockDb.arcs.findUnique.mockResolvedValue(fakeArc);

    const result = await arcService.getArcBySlug("east-blue");

    expect(result).toEqual(fakeArc);
  });

  it("retourne null si le slug n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const result = await arcService.getArcBySlug("inconnu");

    expect(result).toBeNull();
  });
});

describe("arcService.createArc", () => {
  it("crée un arc avec les données fournies", async () => {
    const fakeCreated = { id: 1, name: "Wano", slug: "wano" };
    mockDb.arcs.create.mockResolvedValue(fakeCreated);

    const result = await arcService.createArc({
      name: "Wano",
      content: "L'arc de Wano",
    });

    expect(result).toEqual(fakeCreated);
    expect(mockDb.arcs.create).toHaveBeenCalledTimes(1);
  });
});

describe("arcService.updateArc", () => {
  it("met à jour si l'arc existe", async () => {
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1 });
    const fakeUpdated = { id: 1, name: "Wano Updated" };
    mockDb.arcs.update.mockResolvedValue(fakeUpdated);

    const result = await arcService.updateArc(1, {
      name: "Wano Updated",
      content: "Contenu mis à jour",
    });

    expect(result).toEqual(fakeUpdated);
  });

  it("retourne null si l'arc n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const result = await arcService.updateArc(999, {
      name: "Test",
      content: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("arcService.PatchArc", () => {
  it("modifie partiellement si l'arc existe", async () => {
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1 });
    const fakePatched = { id: 1, name: "Wano Patched" };
    mockDb.arcs.update.mockResolvedValue(fakePatched);

    const result = await arcService.PatchArc(1, {
      name: "Wano Patched",
      content: "Contenu",
    });

    expect(result).toEqual(fakePatched);
  });

  it("retourne null si l'arc n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const result = await arcService.PatchArc(999, {
      name: "Test",
      content: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("arcService.deleteArc", () => {
  it("supprime l'arc et retourne true", async () => {
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1, image: [] });
    mockDb.arcs.delete.mockResolvedValue({});

    const result = await arcService.deleteArc(1);

    expect(result).toBe(true);
    expect(mockDb.arcs.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("supprime aussi l'image Cloudinary si elle existe", async () => {
    mockDb.arcs.findUnique.mockResolvedValue({
      id: 1,
      image: [{ id: 10, publicId: "img_arc" }],
    });
    mockCloudinary.uploader.destroy.mockResolvedValue({});
    mockDb.image.delete.mockResolvedValue({});
    mockDb.arcs.delete.mockResolvedValue({});

    const result = await arcService.deleteArc(1);

    expect(result).toBe(true);
    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith("img_arc");
  });

  it("retourne null si l'arc n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const result = await arcService.deleteArc(999);

    expect(result).toBeNull();
  });
});
