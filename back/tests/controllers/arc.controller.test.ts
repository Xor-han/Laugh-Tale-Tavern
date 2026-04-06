vi.mock("@/services/arc.service", () => ({
  getAllArc: vi.fn(),
  getArcById: vi.fn(),
  getArcBySlug: vi.fn(),
  createArc: vi.fn(),
  updateArc: vi.fn(),
  PatchArc: vi.fn(),
  deleteArc: vi.fn(),
}));

import { Request, Response } from "express";
import * as arcController from "@/controller/arc.controller";
import * as arcService from "@/services/arc.service";

const mockService = arcService as {
  getAllArc: ReturnType<typeof vi.fn>;
  getArcById: ReturnType<typeof vi.fn>;
  getArcBySlug: ReturnType<typeof vi.fn>;
  createArc: ReturnType<typeof vi.fn>;
  updateArc: ReturnType<typeof vi.fn>;
  PatchArc: ReturnType<typeof vi.fn>;
  deleteArc: ReturnType<typeof vi.fn>;
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

describe("arcController.getAll", () => {
  it("retourne 200 avec la liste des arcs", async () => {
    const fakeData = [{ id: 1, name: "East Blue" }];
    mockService.getAllArc.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await arcController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllArc.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await arcController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("arcController.getById", () => {
  it("retourne 200 si l'arc existe", async () => {
    const fakeArc = { id: 1, name: "East Blue" };
    mockService.getArcById.mockResolvedValue(fakeArc);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await arcController.getById(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeArc);
  });

  it("retourne 404 si l'arc n'existe pas", async () => {
    mockService.getArcById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await arcController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("arcController.getBySlug", () => {
  it("retourne 200 si l'arc existe", async () => {
    const fakeArc = { id: 1, slug: "east-blue" };
    mockService.getArcBySlug.mockResolvedValue(fakeArc);
    const req = mockReq({ params: { slug: "east-blue" } });
    const res = mockRes();

    await arcController.getBySlug(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeArc);
  });

  it("retourne 404 si le slug n'existe pas", async () => {
    mockService.getArcBySlug.mockResolvedValue(null);
    const req = mockReq({ params: { slug: "inconnu" } });
    const res = mockRes();

    await arcController.getBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("arcController.create", () => {
  it("retourne 201 avec des données valides", async () => {
    const fakeCreated = { id: 1, name: "Wano" };
    mockService.createArc.mockResolvedValue(fakeCreated);
    const req = mockReq({
      body: { name: "Wano", content: "L'arc de Wano" },
    });
    const res = mockRes();

    await arcController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeCreated);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await arcController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.createArc).not.toHaveBeenCalled();
  });
});

describe("arcController.update", () => {
  it("retourne 200 avec des données valides", async () => {
    const fakeUpdated = { id: 1, name: "Wano Updated" };
    mockService.updateArc.mockResolvedValue(fakeUpdated);
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Wano Updated", content: "Contenu" },
    });
    const res = mockRes();

    await arcController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeUpdated);
  });

  it("retourne 404 si l'arc n'existe pas", async () => {
    mockService.updateArc.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test", content: "Test" },
    });
    const res = mockRes();

    await arcController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ params: { id: "1" }, body: {} });
    const res = mockRes();

    await arcController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.updateArc).not.toHaveBeenCalled();
  });
});

describe("arcController.patch", () => {
  it("retourne 200 avec des données valides", async () => {
    mockService.PatchArc.mockResolvedValue({ id: 1, name: "Patched" });
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Patched", content: "Contenu" },
    });
    const res = mockRes();

    await arcController.patch(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Patched" });
  });

  it("retourne 404 si l'arc n'existe pas", async () => {
    mockService.PatchArc.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test", content: "Test" },
    });
    const res = mockRes();

    await arcController.patch(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("arcController.remove", () => {
  it("retourne 204 si la suppression réussit", async () => {
    mockService.deleteArc.mockResolvedValue(true);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await arcController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("retourne 404 si l'arc n'existe pas", async () => {
    mockService.deleteArc.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await arcController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
