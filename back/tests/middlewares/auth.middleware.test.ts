vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock("better-auth/node", () => ({
  fromNodeHeaders: vi.fn(),
}));

import { Request, Response, NextFunction } from "express";
import { auth } from "@/lib/auth";
import { authMiddleware } from "@/middleware/auth.middleware";

const mockGetSession = auth.api.getSession as ReturnType<typeof vi.fn>;

function mockReq(overrides = {}): Request {
  return { headers: {}, ...overrides } as unknown as Request;
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

describe("authMiddleware", () => {
  it("appelle next() si la session est valide", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1", role: "admin" },
    });
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await authMiddleware(req, res, next);

    expect(req.userId).toBe("user-1");
    expect(req.userRole).toBe("admin");
    expect(next).toHaveBeenCalled();
  });

  it("retourne 401 si pas de session", async () => {
    mockGetSession.mockResolvedValue(null);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Non authentifié" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 401 si la session n'a pas de user.id", async () => {
    mockGetSession.mockResolvedValue({ user: {} });
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 401 si getSession lance une erreur", async () => {
    mockGetSession.mockRejectedValue(new Error("Auth error"));
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Non authentifié" });
    expect(next).not.toHaveBeenCalled();
  });
});
