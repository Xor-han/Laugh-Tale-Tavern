vi.mock("@/services/organisation.service", () => ({
  getAllOrganisation: vi.fn(),
  getOrganisationById: vi.fn(),
  getOrganisationBySlug: vi.fn(),
  createOrganisation: vi.fn(),
  updateOrganisation: vi.fn(),
  PatchOrganisation: vi.fn(),
  deleteOrganisation: vi.fn(),
}));

import { Request, Response } from "express";
import * as organisationController from "@/controller/organisation.controller";
import * as organisationService from "@/services/organisation.service";

const mockService = organisationService as {
  getAllOrganisation: ReturnType<typeof vi.fn>;
  getOrganisationById: ReturnType<typeof vi.fn>;
  getOrganisationBySlug: ReturnType<typeof vi.fn>;
  createOrganisation: ReturnType<typeof vi.fn>;
  updateOrganisation: ReturnType<typeof vi.fn>;
  PatchOrganisation: ReturnType<typeof vi.fn>;
  deleteOrganisation: ReturnType<typeof vi.fn>;
};

function mockReq(overrides = {}): Request {
  return { query: {}, params: {}, body: {}, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("organisationController.getAll", () => {
  it("retourne 200 avec la liste des organisations", async () => {
    const fakeData = [{ id: 1, name: "Marine" }];
    mockService.getAllOrganisation.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await organisationController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllOrganisation.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await organisationController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("organisationController.getById", () => {
  it("retourne 200 si l'organisation existe", async () => {
    const fakeOrg = { id: 1, name: "Marine" };
    mockService.getOrganisationById.mockResolvedValue(fakeOrg);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await organisationController.getById(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeOrg);
  });

  it("retourne 404 si l'organisation n'existe pas", async () => {
    mockService.getOrganisationById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await organisationController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("organisationController.getBySlug", () => {
  it("retourne 200 si l'organisation existe", async () => {
    const fakeOrg = { id: 1, slug: "marine" };
    mockService.getOrganisationBySlug.mockResolvedValue(fakeOrg);
    const req = mockReq({ params: { slug: "marine" } });
    const res = mockRes();

    await organisationController.getBySlug(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeOrg);
  });

  it("retourne 404 si le slug n'existe pas", async () => {
    mockService.getOrganisationBySlug.mockResolvedValue(null);
    const req = mockReq({ params: { slug: "inconnu" } });
    const res = mockRes();

    await organisationController.getBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("organisationController.create", () => {
  it("retourne 201 avec des données valides", async () => {
    const fakeCreated = { id: 1, name: "Marine" };
    mockService.createOrganisation.mockResolvedValue(fakeCreated);
    const req = mockReq({
      body: { name: "Marine", content: "La Marine" },
    });
    const res = mockRes();

    await organisationController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeCreated);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await organisationController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.createOrganisation).not.toHaveBeenCalled();
  });
});

describe("organisationController.update", () => {
  it("retourne 200 avec des données valides", async () => {
    const fakeUpdated = { id: 1, name: "Marine Updated" };
    mockService.updateOrganisation.mockResolvedValue(fakeUpdated);
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Marine Updated", content: "Contenu" },
    });
    const res = mockRes();

    await organisationController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeUpdated);
  });

  it("retourne 404 si l'organisation n'existe pas", async () => {
    mockService.updateOrganisation.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test", content: "Test" },
    });
    const res = mockRes();

    await organisationController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ params: { id: "1" }, body: {} });
    const res = mockRes();

    await organisationController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.updateOrganisation).not.toHaveBeenCalled();
  });
});

describe("organisationController.patch", () => {
  it("retourne 200 avec des données valides", async () => {
    mockService.PatchOrganisation.mockResolvedValue({ id: 1, name: "Patched" });
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Patched", content: "Contenu" },
    });
    const res = mockRes();

    await organisationController.patch(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Patched" });
  });

  it("retourne 404 si l'organisation n'existe pas", async () => {
    mockService.PatchOrganisation.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test", content: "Test" },
    });
    const res = mockRes();

    await organisationController.patch(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("organisationController.remove", () => {
  it("retourne 204 si la suppression réussit", async () => {
    mockService.deleteOrganisation.mockResolvedValue(true);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await organisationController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("retourne 404 si l'organisation n'existe pas", async () => {
    mockService.deleteOrganisation.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await organisationController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
