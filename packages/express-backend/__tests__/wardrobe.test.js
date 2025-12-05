import { jest, describe, beforeEach, test, expect } from "@jest/globals";

const mockFind = jest.fn();
const mockCreate = jest.fn();

jest.unstable_mockModule("mongoose", () => {
  const mongooseMock = {
    Schema: jest.fn(function () {}),
    model: jest.fn(() => ({
      find: mockFind,
      create: mockCreate,
    })),
    set: jest.fn(),
    connect: jest.fn(() => ({
      catch: (handler) => {
        // simulate connection error once at import time
        handler(new Error("connection error (test)"));
      },
    })),
  };

  return {
    __esModule: true,
    default: mongooseMock,
  };
});

const { default: wardrobe } = await import("../wardrobe.js");

describe("wardrobe.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getWardrobe returns clothes when find resolves", async () => {
    const clothes = [
      { description: "shirt", imgurl: "u1", user_id: 1 },
      { description: "pants", imgurl: "u2", user_id: 1 },
    ];
    mockFind.mockResolvedValueOnce(clothes);

    const result = await wardrobe.getWardrobe(1);

    expect(mockFind).toHaveBeenCalledWith({ user_id: 1 });
    expect(result).toBe(clothes);
  });

  test("getWardrobe logs and resolves undefined when find rejects", async () => {
    const error = new Error("find failed");
    mockFind.mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    const result = await wardrobe.getWardrobe(2);

    expect(mockFind).toHaveBeenCalledWith({ user_id: 2 });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("error finding user with user_id: 2"),
      error,
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });

  test("addCloth returns created cloth on success", async () => {
    const cloth = { description: "coat", imgurl: "u", user_id: 3 };
    const created = { ...cloth, _id: "xyz" };

    mockCreate.mockResolvedValueOnce(created);

    const result = await wardrobe.addCloth(cloth);

    expect(mockCreate).toHaveBeenCalledWith(cloth);
    expect(result).toBe(created);
  });

  test("addCloth logs and resolves undefined on error", async () => {
    const cloth = { description: "hat", imgurl: "u", user_id: 4 };
    const error = new Error("create failed");

    mockCreate.mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    const result = await wardrobe.addCloth(cloth);

    expect(mockCreate).toHaveBeenCalledWith(cloth);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("error creating cloth:"),
      error,
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
