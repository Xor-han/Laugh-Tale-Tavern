vi.mock("@/services/article.service", () => ({
  getAllArticles: vi.fn(),
}));

import { Request, Response } from "express";
import * as articleController from "@/controller/article.controller";
import * as articleService from "@/services/article.service";

const mockService = articleService as {
  getAllArticles: ReturnType<typeof vi.fn>;
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

describe("articleController.getAll", () => {
  it("retourne 200 avec la liste des articles", async () => {
    const fakeData = [{ id: 1, name: "Luffy", type: "characters" }];
    mockService.getAllArticles.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await articleController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 400 si les paramètres sont invalides", async () => {
    const req = mockReq({ query: { type: "invalid_type" } });
    const res = mockRes();

    await articleController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.getAllArticles).not.toHaveBeenCalled();
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllArticles.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await articleController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
