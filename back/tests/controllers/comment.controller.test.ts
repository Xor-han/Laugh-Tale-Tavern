vi.mock("@/services/comment.service", () => ({
  getAllComment: vi.fn(),
  getCommentById: vi.fn(),
  createComment: vi.fn(),
  updateComment: vi.fn(),
  deleteComment: vi.fn(),
}));

import { Request, Response } from "express";
import * as commentController from "@/controller/comment.controller";
import * as commentService from "@/services/comment.service";

const mockService = commentService as {
  getAllComment: ReturnType<typeof vi.fn>;
  getCommentById: ReturnType<typeof vi.fn>;
  createComment: ReturnType<typeof vi.fn>;
  updateComment: ReturnType<typeof vi.fn>;
  deleteComment: ReturnType<typeof vi.fn>;
};

function mockReq(overrides = {}): Request {
  return { query: {}, params: {}, body: {}, userId: "user-1", ...overrides } as unknown as Request;
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

describe("commentController.getAll", () => {
  it("retourne 200 avec la liste des commentaires", async () => {
    const fakeData = [{ id: "c1", content: "Super !" }];
    mockService.getAllComment.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await commentController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllComment.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await commentController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("commentController.getById", () => {
  it("retourne 200 si le commentaire existe", async () => {
    const fakeComment = { id: "c1", content: "Super !" };
    mockService.getCommentById.mockResolvedValue(fakeComment);
    const req = mockReq({ params: { id: "c1" } });
    const res = mockRes();

    await commentController.getById(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeComment);
  });

  it("retourne 400 si le commentaire n'existe pas", async () => {
    mockService.getCommentById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "c999" } });
    const res = mockRes();

    await commentController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("commentController.create", () => {
  it("retourne 201 avec des données valides", async () => {
    const fakeCreated = { id: "c1", content: "Mon commentaire" };
    mockService.createComment.mockResolvedValue(fakeCreated);
    const req = mockReq({
      body: { content: "Mon commentaire" },
    });
    const res = mockRes();

    await commentController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeCreated);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await commentController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.createComment).not.toHaveBeenCalled();
  });
});

describe("commentController.update", () => {
  it("retourne 200 avec des données valides", async () => {
    const fakeUpdated = { id: "c1", content: "Modifié" };
    mockService.updateComment.mockResolvedValue(fakeUpdated);
    const req = mockReq({
      params: { id: "c1" },
      body: { content: "Modifié" },
    });
    const res = mockRes();

    await commentController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeUpdated);
  });

  it("retourne 404 si le commentaire n'existe pas", async () => {
    mockService.updateComment.mockResolvedValue(null);
    const req = mockReq({
      params: { id: "c999" },
      body: { content: "Modifié" },
    });
    const res = mockRes();

    await commentController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = mockReq({ params: { id: "c1" }, body: {} });
    const res = mockRes();

    await commentController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockService.updateComment).not.toHaveBeenCalled();
  });
});

describe("commentController.remove", () => {
  it("retourne 204 si la suppression réussit", async () => {
    mockService.deleteComment.mockResolvedValue(true);
    const req = mockReq({ params: { id: "c1" } });
    const res = mockRes();

    await commentController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("retourne 404 si le commentaire n'existe pas", async () => {
    mockService.deleteComment.mockResolvedValue(null);
    const req = mockReq({ params: { id: "c999" } });
    const res = mockRes();

    await commentController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
