vi.mock("@/lib/db", () => ({
  default: {
    arcs: {
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
  arcs: {
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

describe("GET /arcs", () => {
  it("retourne 200 avec la liste des arcs", async () => {
    mockDb.arcs.findMany.mockResolvedValue([{ id: 1, name: "East Blue" }]);

    const res = await request(app).get("/arcs");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "East Blue" }]);
  });
});

describe("GET /arcs/id/:id", () => {
  it("retourne 200 si l'arc existe", async () => {
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1, name: "East Blue" });

    const res = await request(app).get("/arcs/id/1");

    expect(res.status).toBe(200);
  });

  it("retourne 404 si l'arc n'existe pas", async () => {
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/arcs/id/999");

    expect(res.status).toBe(404);
  });
});

describe("POST /arcs", () => {
  it("retourne 201 avec des données valides", async () => {
    mockDb.arcs.create.mockResolvedValue({ id: 1, name: "Wano" });

    const res = await request(app)
      .post("/arcs")
      .send({ name: "Wano", content: "L'arc de Wano" });

    expect(res.status).toBe(201);
  });

  it("retourne 400 avec des données invalides", async () => {
    const res = await request(app)
      .post("/arcs")
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("PUT /arcs/id/:id", () => {
  it("retourne 200 avec des données valides", async () => {
    authenticateAdmin();
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1 });
    mockDb.arcs.update.mockResolvedValue({ id: 1, name: "Updated" });

    const res = await request(app)
      .put("/arcs/id/1")
      .send({ name: "Updated", content: "Contenu" });

    expect(res.status).toBe(200);
  });

  it("retourne 404 si l'arc n'existe pas", async () => {
    authenticateAdmin();
    mockDb.arcs.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .put("/arcs/id/999")
      .send({ name: "Test", content: "Test" });

    expect(res.status).toBe(404);
  });
});

describe("PATCH /arcs/id/:id", () => {
  it("retourne 400 si les données sont invalides", async () => {
    authenticateAdmin();

    const res = await request(app)
      .patch("/arcs/id/1")
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("DELETE /arcs/id/:id", () => {
  it("retourne 204 si la suppression réussit", async () => {
    authenticateAdmin();
    mockDb.arcs.findUnique.mockResolvedValue({ id: 1, image: [] });
    mockDb.arcs.delete.mockResolvedValue({});

    const res = await request(app).delete("/arcs/id/1");

    expect(res.status).toBe(204);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app).delete("/arcs/id/1");

    expect(res.status).toBe(401);
  });
});
