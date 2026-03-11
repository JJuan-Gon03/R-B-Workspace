import { jest } from "@jest/globals";

const mockOn = jest.fn();
const mockSet = jest.fn();
const mockConnect = jest.fn();

jest.unstable_mockModule("mongoose", () => ({
  default: {
    connection: { on: mockOn },
    set: mockSet,
    connect: mockConnect,
  },
}));

jest.unstable_mockModule("dotenv/config", () => ({}));

const { connectDB, handleMongoDBError } = await import("../../src/db.js");

function getHandler(event) {
  const call = mockOn.mock.calls.find(([e]) => e === event);
  return call?.[1];
}

describe("connectDB()", () => {
  const ORIGINAL_URI = process.env.MONGODB_URI;

  afterEach(() => {
    if (ORIGINAL_URI === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = ORIGINAL_URI;
    }
    mockConnect.mockReset();
  });

  test("throws when MONGODB_URI is not set", async () => {
    delete process.env.MONGODB_URI;
    await expect(connectDB()).rejects.toThrow("MONGODB_URI is not set");
    expect(mockConnect).not.toHaveBeenCalled();
  });

  test("connects successfully when MONGODB_URI is set", async () => {
    process.env.MONGODB_URI = "mongodb://localhost/test";
    mockConnect.mockResolvedValueOnce();

    await expect(connectDB()).resolves.toBeUndefined();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://localhost/test", {
      serverSelectionTimeoutMS: 5000,
    });
  });

  test("rethrows error when mongoose.connect fails", async () => {
    process.env.MONGODB_URI = "mongodb://localhost/test";
    const error = new Error("connection failed");
    mockConnect.mockRejectedValueOnce(error);

    await expect(connectDB()).rejects.toThrow("connection failed");
  });
});

describe("handleMongoDBError()", () => {
  function makeRes() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }

  test("returns 422 for ValidationError", () => {
    const res = makeRes();
    handleMongoDBError(res, { name: "ValidationError" });

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      message: "db object validation error",
    });
  });

  test("returns 400 for CastError", () => {
    const res = makeRes();
    handleMongoDBError(res, { name: "CastError" });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid id" });
  });

  test("returns 500 for generic error", () => {
    const res = makeRes();
    handleMongoDBError(res, new Error("something unexpected"));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "db error" });
  });

  test("returns 500 when err is null/undefined", () => {
    const res = makeRes();
    handleMongoDBError(res, null);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "db error" });
  });
});

describe("mongoose connection event listeners", () => {
  test("'connected' handler is registered and callable", () => {
    const handler = getHandler("connected");
    expect(handler).toBeDefined();
    expect(() => handler()).not.toThrow();
  });

  test("'error' handler is registered and callable", () => {
    const handler = getHandler("error");
    expect(handler).toBeDefined();
    expect(() => handler(new Error("mongo error"))).not.toThrow();
  });

  test("'disconnected' handler is registered and callable", () => {
    const handler = getHandler("disconnected");
    expect(handler).toBeDefined();
    expect(() => handler()).not.toThrow();
  });
});
