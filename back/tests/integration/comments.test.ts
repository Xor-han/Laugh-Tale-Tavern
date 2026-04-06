vi.mock("@/lib/db", () => ({
  default: {
    comment: {
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
  comment: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const mockGetSession = auth.api.getSession as ReturnType<typeof vi.fn>;

function authenticateUser(userId = "user-1") {
  mockGetSession.mockResolvedValue({ user: { id: userId, role: "user" } });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /comments", () => {
  it("retourne 200 avec la liste des commentaires", async () => {
    mockDb.comment.findMany.mockResolvedValue([{ id: "c1", content: "Super" }]);

    const res = await request(app).get("/comments");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "c1", content: "Super" }]);
  });
});

describe("POST /comments", () => {
  it("retourne 201 avec des données valides et auth", async () => {
    authenticateUser();
    mockDb.comment.create.mockResolvedValue({ id: "c1", content: "Mon commentaire" });

    const res = await request(app)
      .post("/comments")
      .send({ content: "Mon commentaire" });

    expect(res.status).toBe(201);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app)
      .post("/comments")
      .send({ content: "Test" });

    expect(res.status).toBe(401);
  });

  it("retourne 400 avec des données invalides", async () => {
    authenticateUser();

    const res = await request(app)
      .post("/comments")
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("PUT /comments/:id", () => {
  it("retourne 200 avec des données valides", async () => {
    authenticateUser();
    mockDb.comment.findUnique.mockResolvedValue({ id: "c1", authorId: "user-1" });
    mockDb.comment.update.mockResolvedValue({ id: "c1", content: "Modifié" });

    const res = await request(app)
      .put("/comments/c1")
      .send({ content: "Modifié" });

    expect(res.status).toBe(200);
  });

  it("retourne 404 si le commentaire appartient à un autre", async () => {
    authenticateUser();
    mockDb.comment.findUnique.mockResolvedValue({ id: "c1", authorId: "user-2" });

    const res = await request(app)
      .put("/comments/c1")
      .send({ content: "Modifié" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /comments/:id", () => {
  it("retourne 204 si la suppression réussit", async () => {
    authenticateUser();
    mockDb.comment.findUnique.mockResolvedValue({ id: "c1", authorId: "user-1" });
    mockDb.comment.delete.mockResolvedValue({});

    const res = await request(app).delete("/comments/c1");

    expect(res.status).toBe(204);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app).delete("/comments/c1");

    expect(res.status).toBe(401);
  });
});
