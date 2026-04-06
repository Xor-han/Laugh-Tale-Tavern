vi.mock("@/lib/db", () => ({
  default: {
    onePieceCharacter: {
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
  onePieceCharacter: {
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

describe("GET /characters", () => {
  it("retourne 200 avec la liste des personnages", async () => {
    mockDb.onePieceCharacter.findMany.mockResolvedValue([{ id: 1, name: "Luffy" }]);

    const res = await request(app).get("/characters");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "Luffy" }]);
  });
});

describe("GET /characters/id/:id", () => {
  it("retourne 200 si le personnage existe", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue({ id: 1, name: "Luffy" });

    const res = await request(app).get("/characters/id/1");

    expect(res.status).toBe(200);
  });

  it("retourne 404 si le personnage n'existe pas", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/characters/id/999");

    expect(res.status).toBe(404);
  });
});

describe("GET /characters/:slug", () => {
  it("retourne 200 si le personnage existe", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue({ id: 1, slug: "luffy" });

    const res = await request(app).get("/characters/luffy");

    expect(res.status).toBe(200);
  });

  it("retourne 404 si le slug n'existe pas", async () => {
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/characters/inconnu");

    expect(res.status).toBe(404);
  });
});

describe("POST /characters", () => {
  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app)
      .post("/characters")
      .send({ name: "Luffy", content: "Capitaine", profession: "capitaine" });

    expect(res.status).toBe(401);
  });

  it("retourne 201 avec des données valides et auth admin", async () => {
    authenticateAdmin();
    mockDb.onePieceCharacter.create.mockResolvedValue({ id: 1, name: "Luffy" });

    const res = await request(app)
      .post("/characters")
      .send({ name: "Luffy", content: "Capitaine", profession: "capitaine" });

    expect(res.status).toBe(201);
  });

  it("retourne 400 avec des données invalides", async () => {
    authenticateAdmin();

    const res = await request(app)
      .post("/characters")
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("PUT /characters/id/:id", () => {
  it("retourne 200 avec des données valides", async () => {
    authenticateAdmin();
    mockDb.onePieceCharacter.findUnique.mockResolvedValue({ id: 1 });
    mockDb.onePieceCharacter.update.mockResolvedValue({ id: 1, name: "Updated" });

    const res = await request(app)
      .put("/characters/id/1")
      .send({ name: "Updated", content: "Contenu", profession: "capitaine" });

    expect(res.status).toBe(200);
  });

  it("retourne 404 si le personnage n'existe pas", async () => {
    authenticateAdmin();
    mockDb.onePieceCharacter.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .put("/characters/id/999")
      .send({ name: "Test", content: "Test", profession: "capitaine" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /characters/id/:id", () => {
  it("retourne 204 si la suppression réussit", async () => {
    authenticateAdmin();
    mockDb.onePieceCharacter.findUnique.mockResolvedValue({ id: 1, image: [] });
    mockDb.onePieceCharacter.delete.mockResolvedValue({});

    const res = await request(app).delete("/characters/id/1");

    expect(res.status).toBe(204);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app).delete("/characters/id/1");

    expect(res.status).toBe(401);
  });
});
