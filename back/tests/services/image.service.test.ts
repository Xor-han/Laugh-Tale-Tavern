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

import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import * as imageService from "@/services/image.service";

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("imageService.getAllImages", () => {
  it("retourne toutes les images", async () => {
    const fakeImages = [{ id: 1, url: "https://example.com/img.webp" }];
    mockDb.image.findMany.mockResolvedValue(fakeImages);

    const result = await imageService.getAllImages();

    expect(result).toEqual(fakeImages);
    expect(mockDb.image.findMany).toHaveBeenCalledTimes(1);
  });
});

describe("imageService.uploadImage", () => {
  it("upload une image sur Cloudinary et crée en DB", async () => {
    const fakeStream = {
      end: vi.fn(),
    };
    mockCloudinary.uploader.upload_stream.mockImplementation(
      (_options: any, callback: any) => {
        callback(null, {
          secure_url: "https://cloudinary.com/img.webp",
          public_id: "img_123",
        });
        return fakeStream;
      },
    );
    const fakeImage = { id: 1, url: "https://cloudinary.com/img.webp", publicId: "img_123" };
    mockDb.image.create.mockResolvedValue(fakeImage);

    const result = await imageService.uploadImage(Buffer.from("fake-data"));

    expect(result).toEqual(fakeImage);
    expect(mockDb.image.create).toHaveBeenCalledTimes(1);
  });
});

describe("imageService.deleteImage", () => {
  it("supprime l'image de Cloudinary et de la DB", async () => {
    mockDb.image.findUnique.mockResolvedValue({ id: 1, publicId: "img_123" });
    mockCloudinary.uploader.destroy.mockResolvedValue({});
    mockDb.image.delete.mockResolvedValue({});

    const result = await imageService.deleteImage(1);

    expect(result).toBe(true);
    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith("img_123");
    expect(mockDb.image.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("retourne null si l'image n'existe pas", async () => {
    mockDb.image.findUnique.mockResolvedValue(null);

    const result = await imageService.deleteImage(999);

    expect(result).toBeNull();
  });
});
