import { jest } from "@jest/globals";

jest.unstable_mockModule("dotenv/config", () => ({}));

const mockDestroy = jest.fn();

jest.unstable_mockModule("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      destroy: mockDestroy,
    },
  },
}));

const { delete_image_from_cloudinary } =
  await import("../../../src/services/cloudinary.service.js");

beforeEach(() => {
  mockDestroy.mockReset();
});

// ── delete_image_from_cloudinary ────────────────────────────────────────────

describe("delete_image_from_cloudinary()", () => {
  test("calls cloudinary.uploader.destroy with correct public_id", async () => {
    mockDestroy.mockResolvedValue({ result: "ok" });

    await delete_image_from_cloudinary("uploads/my_image");

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockDestroy).toHaveBeenCalledWith("uploads/my_image");
  });

  test("resolves successfully when destroy succeeds", async () => {
    mockDestroy.mockResolvedValue({ result: "ok" });
    await expect(
      delete_image_from_cloudinary("uploads/any_id")
    ).resolves.toBeUndefined();
  });

  test("propagates error when destroy fails", async () => {
    mockDestroy.mockRejectedValue(new Error("Cloudinary error"));
    await expect(
      delete_image_from_cloudinary("uploads/bad_id")
    ).rejects.toThrow("Cloudinary error");
  });

  test("calls destroy with different public_ids correctly", async () => {
    mockDestroy.mockResolvedValue({ result: "ok" });

    await delete_image_from_cloudinary("folder/image_abc123");

    expect(mockDestroy).toHaveBeenCalledWith("folder/image_abc123");
  });
});
