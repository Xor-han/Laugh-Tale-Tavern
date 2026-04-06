vi.mock("@/services/crew.service", () => ({
  getAllCrew: vi.fn(),
  getCrewById: vi.fn(),
  getCrewBySlug: vi.fn(),
  createCrew: vi.fn(),
  updateCrew: vi.fn(),
  PatchCrew: vi.fn(),
  deleteCrew: vi.fn(),
}));

import { Request, Response } from "express";
import * as crewController from "@/controller/crew.controller";
import * as crewService from "@/services/crew.service";

const mockService = crewService as {
  getAllCrew: ReturnType<typeof vi.fn>;
  getCrewById: ReturnType<typeof vi.fn>;
  getCrewBySlug: ReturnType<typeof vi.fn>;
  createCrew: ReturnType<typeof vi.fn>;
  updateCrew: ReturnType<typeof vi.fn>;
  PatchCrew: ReturnType<typeof vi.fn>;
  deleteCrew: ReturnType<typeof vi.fn>;
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

describe("crewController.getAll", () => {
  it("retourne 200 avec la liste des équipages", async () => {
    const fakeData = [{ id: 1, name: "Mugiwara" }];
    mockService.getAllCrew.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await crewController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllCrew.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await crewController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("crewController.getById", () => {
  it("retourne 200 si l'équipage existe", async () => {
    const fakeCrew = { id: 1, name: "Mugiwara" };
    mockService.getCrewById.mockResolvedValue(fakeCrew);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await crewController.getById(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeCrew);
  });

  it("retourne 404 si l'équipage n'existe pas", async () => {
    mockService.getCrewById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await crewController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("crewController.getBySlug", () => {
  it("retourne 200 si l'équipage existe", async () => {
    const fakeCrew = { id: 1, slug: "mugiwara" };
    mockService.getCrewBySlug.mockResolvedValue(fakeCrew);
    const req = mockReq({ params: { slug: "mugiwara" } });
    const res = mockRes();

    await crewController.getBySlug(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeCrew);
  });

  it("retourne 404 si le slug n'existe pas", async () => {
    mockService.getCrewBySlug.mockResolvedValue(null);
    const req = mockReq({ params: { slug: "inconnu" } });
    const res = mockRes();

    await crewController.getBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("crewController.create", () => {
  it("retourne 201 avec des données valides", async () => {
    const fakeCreated = { id: 1, name: "Mugiwara" };
    mockService.createCrew.mockResolvedValue(fakeCreated);
    const req = mockReq({
      body: { name: "Mugiwara", content: "L'équipage du Chapeau de Paille" },
    });
    const res = mockRes();

    await crewController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeCreated);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await crewController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.createCrew).not.toHaveBeenCalled();
  });
});

describe("crewController.update", () => {
  it("retourne 200 avec des données valides", async () => {
    const fakeUpdated = { id: 1, name: "Mugiwara Updated" };
    mockService.updateCrew.mockResolvedValue(fakeUpdated);
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Mugiwara Updated", content: "Contenu" },
    });
    const res = mockRes();

    await crewController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeUpdated);
  });

  it("retourne 404 si l'équipage n'existe pas", async () => {
    mockService.updateCrew.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test", content: "Test" },
    });
    const res = mockRes();

    await crewController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ params: { id: "1" }, body: {} });
    const res = mockRes();

    await crewController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.updateCrew).not.toHaveBeenCalled();
  });
});

describe("crewController.patch", () => {
  it("retourne 200 avec des données valides", async () => {
    mockService.PatchCrew.mockResolvedValue({ id: 1, name: "Patched" });
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Patched", content: "Contenu" },
    });
    const res = mockRes();

    await crewController.patch(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Patched" });
  });

  it("retourne 404 si l'équipage n'existe pas", async () => {
    mockService.PatchCrew.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test", content: "Test" },
    });
    const res = mockRes();

    await crewController.patch(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("crewController.remove", () => {
  it("retourne 204 si la suppression réussit", async () => {
    mockService.deleteCrew.mockResolvedValue(true);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await crewController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("retourne 404 si l'équipage n'existe pas", async () => {
    mockService.deleteCrew.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await crewController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
