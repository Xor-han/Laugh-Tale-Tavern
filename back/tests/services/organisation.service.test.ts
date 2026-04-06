vi.mock("@/lib/db", () => ({
  default: {
    organisation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    arcs: {
      findUnique: vi.fn(),
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
import * as organisationService from "@/services/organisation.service";

const mockDb = db as unknown as {
  organisation: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  arcs: {
    findUnique: ReturnType<typeof vi.fn>;
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

describe("organisationService.getAllOrganisation", () => {
  it("retourne toutes les organisations", async () => {
    const fakeOrgs = [{ id: 1, name: "Marine" }];
    mockDb.organisation.findMany.mockResolvedValue(fakeOrgs);

    const result = await organisationService.getAllOrganisation();

    expect(result).toEqual(fakeOrgs);
    expect(mockDb.organisation.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("organisationService.getOrganisationById", () => {
  it("retourne l'organisation si elle existe", async () => {
    const fakeOrg = { id: 1, name: "Marine" };
    mockDb.organisation.findUnique.mockResolvedValue(fakeOrg);

    const result = await organisationService.getOrganisationById(1);

    expect(result).toEqual(fakeOrg);
  });

  it("retourne null si l'organisation n'existe pas", async () => {
    mockDb.organisation.findUnique.mockResolvedValue(null);

    const result = await organisationService.getOrganisationById(999);

    expect(result).toBeNull();
  });
});

describe("organisationService.getOrganisationBySlug", () => {
  it("retourne l'organisation par slug", async () => {
    const fakeOrg = { id: 1, name: "Marine", slug: "marine" };
    mockDb.organisation.findUnique.mockResolvedValue(fakeOrg);

    const result = await organisationService.getOrganisationBySlug("marine");

    expect(result).toEqual(fakeOrg);
  });

  it("retourne null si le slug n'existe pas", async () => {
    mockDb.organisation.findUnique.mockResolvedValue(null);

    const result = await organisationService.getOrganisationBySlug("inconnu");

    expect(result).toBeNull();
  });
});

describe("organisationService.createOrganisation", () => {
  it("crée une organisation avec les données fournies", async () => {
    const fakeCreated = { id: 1, name: "Marine", slug: "marine" };
    mockDb.organisation.create.mockResolvedValue(fakeCreated);

    const result = await organisationService.createOrganisation({
      name: "Marine",
      content: "La Marine du Gouvernement Mondial",
    });

    expect(result).toEqual(fakeCreated);
    expect(mockDb.organisation.create).toHaveBeenCalledTimes(1);
  });
});

describe("organisationService.updateOrganisation", () => {
  it("met à jour si l'organisation existe", async () => {
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1 });
    const fakeUpdated = { id: 1, name: "Marine Updated" };
    mockDb.organisation.update.mockResolvedValue(fakeUpdated);

    const result = await organisationService.updateOrganisation(1, {
      name: "Marine Updated",
      content: "Contenu mis à jour",
    });

    expect(result).toEqual(fakeUpdated);
  });

  it("retourne null si l'organisation n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const result = await organisationService.updateOrganisation(999, {
      name: "Test",
      content: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("organisationService.PatchOrganisation", () => {
  it("modifie partiellement si l'organisation existe", async () => {
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1 });
    const fakePatched = { id: 1, name: "Marine Patched" };
    mockDb.organisation.update.mockResolvedValue(fakePatched);

    const result = await organisationService.PatchOrganisation(1, {
      name: "Marine Patched",
      content: "Contenu",
    });

    expect(result).toEqual(fakePatched);
  });

  it("retourne null si l'organisation n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const result = await organisationService.PatchOrganisation(999, {
      name: "Test",
      content: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("organisationService.deleteOrganisation", () => {
  it("supprime l'organisation et retourne true", async () => {
    mockDb.organisation.findUnique.mockResolvedValue({ id: 1, image: [] });
    mockDb.organisation.delete.mockResolvedValue({});

    const result = await organisationService.deleteOrganisation(1);

    expect(result).toBe(true);
    expect(mockDb.organisation.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("supprime aussi l'image Cloudinary si elle existe", async () => {
    mockDb.organisation.findUnique.mockResolvedValue({
      id: 1,
      image: [{ id: 10, publicId: "img_org" }],
    });
    mockCloudinary.uploader.destroy.mockResolvedValue({});
    mockDb.image.delete.mockResolvedValue({});
    mockDb.organisation.delete.mockResolvedValue({});

    const result = await organisationService.deleteOrganisation(1);

    expect(result).toBe(true);
    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith("img_org");
  });

  it("retourne null si l'organisation n'existe pas", async () => {
    mockDb.organisation.findUnique.mockResolvedValue(null);

    const result = await organisationService.deleteOrganisation(999);

    expect(result).toBeNull();
  });
});
