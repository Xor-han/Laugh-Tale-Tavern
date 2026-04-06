vi.mock("@/services/devilFruit.service", () => ({
  getAllDevilFruit: vi.fn(),
  getDevilFruitById: vi.fn(),
  getDevilFruitBySlug: vi.fn(),
  createDevilFruit: vi.fn(),
  updateDevilFruit: vi.fn(),
  PatchDevilFruit: vi.fn(),
  deleteDevilFruit: vi.fn(),
}));

import { Request, Response } from "express";
import * as devilFruitController from "@/controller/devilFruit.controller";
import * as devilFruitService from "@/services/devilFruit.service";

const mockService = devilFruitService as {
  getAllDevilFruit: ReturnType<typeof vi.fn>;
  getDevilFruitById: ReturnType<typeof vi.fn>;
  getDevilFruitBySlug: ReturnType<typeof vi.fn>;
  createDevilFruit: ReturnType<typeof vi.fn>;
  updateDevilFruit: ReturnType<typeof vi.fn>;
  PatchDevilFruit: ReturnType<typeof vi.fn>;
  deleteDevilFruit: ReturnType<typeof vi.fn>;
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

describe("devilFruitController.getAll", () => {
  it("retourne 200 avec la liste des fruits du démon", async () => {
    const fakeData = [{ id: 1, name: "Gomu Gomu no Mi" }];
    mockService.getAllDevilFruit.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await devilFruitController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllDevilFruit.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await devilFruitController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("devilFruitController.getById", () => {
  it("retourne 200 si le fruit existe", async () => {
    const fakeFruit = { id: 1, name: "Gomu Gomu no Mi" };
    mockService.getDevilFruitById.mockResolvedValue(fakeFruit);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await devilFruitController.getById(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeFruit);
  });

  it("retourne 404 si le fruit n'existe pas", async () => {
    mockService.getDevilFruitById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await devilFruitController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("devilFruitController.getBySlug", () => {
  it("retourne 200 si le fruit existe", async () => {
    const fakeFruit = { id: 1, slug: "gomu-gomu-no-mi" };
    mockService.getDevilFruitBySlug.mockResolvedValue(fakeFruit);
    const req = mockReq({ params: { slug: "gomu-gomu-no-mi" } });
    const res = mockRes();

    await devilFruitController.getBySlug(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeFruit);
  });

  it("retourne 404 si le slug n'existe pas", async () => {
    mockService.getDevilFruitBySlug.mockResolvedValue(null);
    const req = mockReq({ params: { slug: "inconnu" } });
    const res = mockRes();

    await devilFruitController.getBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("devilFruitController.create", () => {
  it("retourne 201 avec des données valides", async () => {
    const fakeCreated = { id: 1, name: "Mera Mera no Mi" };
    mockService.createDevilFruit.mockResolvedValue(fakeCreated);
    const req = mockReq({
      body: { name: "Mera Mera no Mi", content: "Fruit du feu" },
    });
    const res = mockRes();

    await devilFruitController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeCreated);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await devilFruitController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.createDevilFruit).not.toHaveBeenCalled();
  });
});

describe("devilFruitController.update", () => {
  it("retourne 200 avec des données valides", async () => {
    const fakeUpdated = { id: 1, name: "Mera Updated" };
    mockService.updateDevilFruit.mockResolvedValue(fakeUpdated);
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Mera Updated", content: "Contenu" },
    });
    const res = mockRes();

    await devilFruitController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeUpdated);
  });

  it("retourne 404 si le fruit n'existe pas", async () => {
    mockService.updateDevilFruit.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test", content: "Test" },
    });
    const res = mockRes();

    await devilFruitController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ params: { id: "1" }, body: {} });
    const res = mockRes();

    await devilFruitController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.updateDevilFruit).not.toHaveBeenCalled();
  });
});

describe("devilFruitController.remove", () => {
  it("retourne 204 si la suppression réussit", async () => {
    mockService.deleteDevilFruit.mockResolvedValue(true);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await devilFruitController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("retourne 404 si le fruit n'existe pas", async () => {
    mockService.deleteDevilFruit.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await devilFruitController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
