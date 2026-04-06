vi.mock("@/lib/db", () => ({
  default: {
    onePieceCharacter: { findMany: vi.fn() },
    devilFruit: { findMany: vi.fn() },
    arcs: { findMany: vi.fn() },
    crews: { findMany: vi.fn() },
    organisation: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock("better-auth/node", () => ({
  fromNodeHeaders: vi.fn(),
  toNodeHandler: vi.fn(() => (_req: any, _res: any, next: any) => next()),
}));

import request from "supertest";
import app from "@/app";
import db from "@/lib/db";

const mockDb = db as unknown as {
  onePieceCharacter: { findMany: ReturnType<typeof vi.fn> };
  devilFruit: { findMany: ReturnType<typeof vi.fn> };
  arcs: { findMany: ReturnType<typeof vi.fn> };
  crews: { findMany: ReturnType<typeof vi.fn> };
  organisation: { findMany: ReturnType<typeof vi.fn> };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /articles", () => {
  it("retourne 200 avec la liste des articles", async () => {
    mockDb.onePieceCharacter.findMany.mockResolvedValue([{ id: 1, name: "Luffy", slug: "luffy", content: "C", image: [] }]);
    mockDb.devilFruit.findMany.mockResolvedValue([]);
    mockDb.arcs.findMany.mockResolvedValue([]);
    mockDb.crews.findMany.mockResolvedValue([]);
    mockDb.organisation.findMany.mockResolvedValue([]);

    const res = await request(app).get("/articles");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("retourne 200 avec un filtre type valide", async () => {
    mockDb.arcs.findMany.mockResolvedValue([{ id: 1, name: "East Blue", slug: "east-blue", content: "C", image: [] }]);

    const res = await request(app).get("/articles?type=arcs");

    expect(res.status).toBe(200);
  });

  it("retourne 400 avec un type invalide", async () => {
    const res = await request(app).get("/articles?type=invalid");

    expect(res.status).toBe(400);
  });
});
