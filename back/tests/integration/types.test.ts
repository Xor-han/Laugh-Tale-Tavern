vi.mock("@/lib/db", () => ({
  default: {
    type: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
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
import { auth } from "@/lib/auth";

const mockDb = db as unknown as {
  type: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const mockGetSession = auth.api.getSession as ReturnType<typeof vi.fn>;

function authenticateAdmin(userId = "user-1") {
  mockGetSession.mockResolvedValue({ user: { id: userId, role: "admin" } });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /types", () => {
  it("retourne 200 avec la liste des types", async () => {
    mockDb.type.findMany.mockResolvedValue([{ id: 1, name: "Paramecia" }]);

    const res = await request(app).get("/types");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "Paramecia" }]);
  });
});

describe("POST /types", () => {
  it("retourne 201 avec des données valides et auth admin", async () => {
    authenticateAdmin();
    mockDb.type.create.mockResolvedValue({ id: 1, name: "Logia" });

    const res = await request(app)
      .post("/types")
      .send({ name: "Logia" });

    expect(res.status).toBe(201);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app)
      .post("/types")
      .send({ name: "Test" });

    expect(res.status).toBe(401);
  });

  it("retourne 400 avec des données invalides", async () => {
    authenticateAdmin();

    const res = await request(app)
      .post("/types")
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("PUT /types/:id", () => {
  it("retourne 200 avec des données valides", async () => {
    authenticateAdmin();
    mockDb.type.findUnique.mockResolvedValue({ id: 1 });
    mockDb.type.update.mockResolvedValue({ id: 1, name: "Zoan" });

    const res = await request(app)
      .put("/types/1")
      .send({ name: "Zoan" });

    expect(res.status).toBe(200);
  });

  it("retourne 404 si le type n'existe pas", async () => {
    authenticateAdmin();
    mockDb.type.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .put("/types/999")
      .send({ name: "Test" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /types/:id", () => {
  it("retourne 204 si la suppression réussit", async () => {
    authenticateAdmin();
    mockDb.type.findUnique.mockResolvedValue({ id: 1 });
    mockDb.type.delete.mockResolvedValue({});

    const res = await request(app).delete("/types/1");

    expect(res.status).toBe(204);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app).delete("/types/1");

    expect(res.status).toBe(401);
  });
});
