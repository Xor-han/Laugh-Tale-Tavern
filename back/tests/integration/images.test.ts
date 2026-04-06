vi.mock("@/lib/db", () => ({
  default: {
    image: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/cloudinary", () => ({
  default: {
    uploader: {
      upload_stream: vi.fn(),
      destroy: vi.fn(),
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
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

const mockDb = db as unknown as {
  image: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const mockCloudinary = cloudinary as unknown as {
  uploader: {
    upload_stream: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
  };
};

const mockGetSession = auth.api.getSession as ReturnType<typeof vi.fn>;

function authenticateAdmin(userId = "user-1") {
  mockGetSession.mockResolvedValue({ user: { id: userId, role: "admin" } });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /images", () => {
  it("retourne 200 avec la liste des images", async () => {
    mockDb.image.findMany.mockResolvedValue([{ id: 1, url: "https://example.com/img.webp" }]);

    const res = await request(app).get("/images");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, url: "https://example.com/img.webp" }]);
  });
});

describe("POST /images", () => {
  it("retourne 201 avec un fichier valide et auth admin", async () => {
    authenticateAdmin();
    const fakeStream = { end: vi.fn() };
    mockCloudinary.uploader.upload_stream.mockImplementation(
      (_options: any, callback: any) => {
        callback(null, {
          secure_url: "https://cloudinary.com/img.webp",
          public_id: "img_123",
        });
        return fakeStream;
      },
    );
    mockDb.image.create.mockResolvedValue({
      id: 1,
      url: "https://cloudinary.com/img.webp",
      publicId: "img_123",
    });

    const res = await request(app)
      .post("/images")
      .attach("image", Buffer.from("fake-image-data"), "photo.png");

    expect(res.status).toBe(201);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app)
      .post("/images")
      .attach("image", Buffer.from("fake"), "photo.png");

    expect(res.status).toBe(401);
  });
});

describe("DELETE /images/:id", () => {
  it("retourne 204 si la suppression réussit", async () => {
    authenticateAdmin();
    mockDb.image.findUnique.mockResolvedValue({ id: 1, publicId: "img_123" });
    mockCloudinary.uploader.destroy.mockResolvedValue({});
    mockDb.image.delete.mockResolvedValue({});

    const res = await request(app).delete("/images/1");

    expect(res.status).toBe(204);
  });

  it("retourne 404 si l'image n'existe pas", async () => {
    authenticateAdmin();
    mockDb.image.findUnique.mockResolvedValue(null);

    const res = await request(app).delete("/images/999");

    expect(res.status).toBe(404);
  });

  it("retourne 401 sans authentification", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await request(app).delete("/images/1");

    expect(res.status).toBe(401);
  });
});
