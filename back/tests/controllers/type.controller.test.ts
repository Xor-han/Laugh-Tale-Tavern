vi.mock("@/services/type.service", () => ({
  getAllType: vi.fn(),
  getTypeById: vi.fn(),
  createType: vi.fn(),
  updateType: vi.fn(),
  deleteType: vi.fn(),
}));

import { Request, Response } from "express";
import * as typeController from "@/controller/type.controller";
import * as typeService from "@/services/type.service";

const mockService = typeService as {
  getAllType: ReturnType<typeof vi.fn>;
  getTypeById: ReturnType<typeof vi.fn>;
  createType: ReturnType<typeof vi.fn>;
  updateType: ReturnType<typeof vi.fn>;
  deleteType: ReturnType<typeof vi.fn>;
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

describe("typeController.getAll", () => {
  it("retourne 200 avec la liste des types", async () => {
    const fakeData = [{ id: 1, name: "Paramecia" }];
    mockService.getAllType.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await typeController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllType.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await typeController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("typeController.getById", () => {
  it("retourne 400 si le type n'existe pas", async () => {
    mockService.getTypeById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await typeController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("typeController.create", () => {
  it("retourne 201 avec des données valides", async () => {
    const fakeCreated = { id: 1, name: "Logia" };
    mockService.createType.mockResolvedValue(fakeCreated);
    const req = mockReq({ body: { name: "Logia" } });
    const res = mockRes();

    await typeController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeCreated);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await typeController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.createType).not.toHaveBeenCalled();
  });
});

describe("typeController.update", () => {
  it("retourne 200 avec des données valides", async () => {
    const fakeUpdated = { id: 1, name: "Zoan" };
    mockService.updateType.mockResolvedValue(fakeUpdated);
    const req = mockReq({
      params: { id: "1" },
      body: { name: "Zoan" },
    });
    const res = mockRes();

    await typeController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeUpdated);
  });

  it("retourne 404 si le type n'existe pas", async () => {
    mockService.updateType.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "999" },
      body: { name: "Test" },
    });
    const res = mockRes();

    await typeController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ params: { id: "1" }, body: {} });
    const res = mockRes();

    await typeController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.updateType).not.toHaveBeenCalled();
  });
});

describe("typeController.remove", () => {
  it("retourne 204 si la suppression réussit", async () => {
    mockService.deleteType.mockResolvedValue(true);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await typeController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("retourne 404 si le type n'existe pas", async () => {
    mockService.deleteType.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await typeController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
