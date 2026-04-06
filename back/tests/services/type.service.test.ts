vi.mock("@/lib/db", () => ({
  default: {
    type: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import db from "@/lib/db";
import * as typeService from "@/services/type.service";

const mockDb = db as unknown as {
  type: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("typeService.getAllType", () => {
  it("retourne tous les types", async () => {
    const fakeTypes = [{ id: 1, name: "Paramecia" }];
    mockDb.type.findMany.mockResolvedValue(fakeTypes);

    const result = await typeService.getAllType();

    expect(result).toEqual(fakeTypes);
    expect(mockDb.type.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("typeService.getTypeById", () => {
  it("retourne le type si il existe", async () => {
    const fakeType = { id: 1, name: "Paramecia" };
    mockDb.type.findUnique.mockResolvedValue(fakeType);

    const result = await typeService.getTypeById(1);

    expect(result).toEqual(fakeType);
  });

  it("retourne null si le type n'existe pas", async () => {
    mockDb.type.findUnique.mockResolvedValue(null);

    const result = await typeService.getTypeById(999);

    expect(result).toBeNull();
  });
});

describe("typeService.createType", () => {
  it("crée un type avec les données fournies", async () => {
    const fakeCreated = { id: 1, name: "Logia" };
    mockDb.type.create.mockResolvedValue(fakeCreated);

    const result = await typeService.createType({ name: "Logia" });

    expect(result).toEqual(fakeCreated);
    expect(mockDb.type.create).toHaveBeenCalledTimes(1);
  });
});

describe("typeService.updateType", () => {
  it("met à jour si le type existe", async () => {
    mockDb.type.findUnique.mockResolvedValue({ id: 1 });
    const fakeUpdated = { id: 1, name: "Zoan" };
    mockDb.type.update.mockResolvedValue(fakeUpdated);

    const result = await typeService.updateType(1, { name: "Zoan" });

    expect(result).toEqual(fakeUpdated);
  });

  it("retourne null si le type n'existe pas", async () => {
    mockDb.type.findUnique.mockResolvedValue(null);

    const result = await typeService.updateType(999, { name: "Test" });

    expect(result).toBeNull();
  });
});

describe("typeService.deleteType", () => {
  it("supprime le type et retourne true", async () => {
    mockDb.type.findUnique.mockResolvedValue({ id: 1 });
    mockDb.type.delete.mockResolvedValue({});

    const result = await typeService.deleteType(1);

    expect(result).toBe(true);
    expect(mockDb.type.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("retourne null si le type n'existe pas", async () => {
    mockDb.type.findUnique.mockResolvedValue(null);

    const result = await typeService.deleteType(999);

    expect(result).toBeNull();
  });
});
