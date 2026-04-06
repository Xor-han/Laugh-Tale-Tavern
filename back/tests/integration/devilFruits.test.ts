vi.mock("@/lib/db", () => ({
  default: {
    devilFruit: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    image: {
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/cloudinary", () => ({
  default: {
    uploader: { destroy: vi.fn() },
  },
}));

vi.mock("@/utils/slugify", () => ({
  slugify: vi.fn((text: string) => text.toLowerCase().replace(/\s+/g, "-")),
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
  devilFruit: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  image: { delete: ReturnType<typeof vi.fn> };
};

const mockGetSession = auth.api.getSession as ReturnType<typeof vi.fn>;

function authenticateAdmin(userId = "user-1") {
  mockGetSession.mockResolvedValue({ user: { id: userId, role: "admin" } });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /devilFruits", () => {
  it("retourne 200 avec la liste des fruits du démon", async () => {
    mockDb.devilFruit.findMany.mockResolvedValue([{ id: 1, name: "Gomu Gomu" }]);

    const res = await request(app).get("/devilFruits");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "Gomu Gomu" }]);
  });
});

describe("GET /devilFruits/id/:id", () => {
  it("retourne 200 si le fruit existe", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue({ id: 1, name: "Gomu Gomu" });

    const res = await request(app).get("/devilFruits/id/1");

    expect(res.status).toBe(200);
  });

  it("retourne 404 si le fruit n'existe pas", async () => {
    mockDb.devilFruit.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/devilFruits/id/999");

    expect(res.status).toBe(404);
  });
});

describe("POST /devilFruits", () => {
  it("retourne 201 avec des données valides et auth admin", async () => {
    authenticateAdmin();
    mockDb.devilFruit.create.mockResolvedValue({ id: 1, name: "Mera Mera" });

    const res = await request(app)
      .post("/devilFruits")
      .send({ name: "Mera Mera", content: "Fruit du feu" });

    expect(res.status).toBe(201);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app)
      .post("/devilFruits")
      .send({ name: "Test", content: "Test" });

    expect(res.status).toBe(401);
  });

  it("retourne 400 avec des données invalides", async () => {
    authenticateAdmin();

    const res = await request(app)
      .post("/devilFruits")
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("DELETE /devilFruits/id/:id", () => {
  it("retourne 204 si la suppression réussit", async () => {
    authenticateAdmin();
    mockDb.devilFruit.findUnique.mockResolvedValue({ id: 1, image: [] });
    mockDb.devilFruit.delete.mockResolvedValue({});

    const res = await request(app).delete("/devilFruits/id/1");

    expect(res.status).toBe(204);
  });
});
