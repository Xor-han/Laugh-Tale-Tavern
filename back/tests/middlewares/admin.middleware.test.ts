import { Request, Response, NextFunction } from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";

function mockReq(overrides = {}): Request {
  return { userRole: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("adminMiddleware", () => {
  it("appelle next() si l'utilisateur est admin", () => {
    const req = mockReq({ userRole: "admin" });
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    adminMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("retourne 403 si l'utilisateur n'est pas admin", () => {
    const req = mockReq({ userRole: "user" });
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Accès interdit" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 403 si aucun rôle n'est défini", () => {
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
