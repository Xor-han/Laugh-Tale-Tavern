vi.mock("@/services/image.service", () => ({
  getAllImages: vi.fn(),
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}));

import { Request, Response } from "express";
import * as imageController from "@/controller/image.controller";
import * as imageService from "@/services/image.service";

const mockService = imageService as {
  getAllImages: ReturnType<typeof vi.fn>;
  uploadImage: ReturnType<typeof vi.fn>;
  deleteImage: ReturnType<typeof vi.fn>;
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

describe("imageController.getAll", () => {
  it("retourne 200 avec la liste des images", async () => {
    const fakeData = [{ id: 1, url: "https://example.com/img.webp" }];
    mockService.getAllImages.mockResolvedValue(fakeData);
    const req = mockReq();
    const res = mockRes();

    await imageController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it("retourne 500 en cas d'erreur serveur", async () => {
    mockService.getAllImages.mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await imageController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("imageController.upload", () => {
  it("retourne 201 avec un fichier valide", async () => {
    const fakeImage = { id: 1, url: "https://cloudinary.com/img.webp" };
    mockService.uploadImage.mockResolvedValue(fakeImage);
    const req = mockReq({
      file: { buffer: Buffer.from("fake-image-data") },
    });
    const res = mockRes();

    await imageController.upload(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeImage);
  });

  it("retourne 400 si aucun fichier n'est fourni", async () => {
    const req = mockReq();
    const res = mockRes();

    await imageController.upload(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Aucune image fournie" });
  });
});

describe("imageController.remove", () => {
  it("retourne 204 si la suppression réussit", async () => {
    mockService.deleteImage.mockResolvedValue(true);
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    await imageController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("retourne 404 si l'image n'existe pas", async () => {
    mockService.deleteImage.mockResolvedValue(null);
    const req = mockReq({ params: { id: "999" } });
    const res = mockRes();

    await imageController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
