// __tests__/backend.test.js
import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import request from "supertest";

// --- Mocks for gemini and wardrobe -------------------------

const geminiMock = {
  main: jest.fn(),
  parse_cloth: jest.fn(),
};

const wardrobeMock = {
  addCloth: jest.fn(),
  getWardrobe: jest.fn(),
};

// In ESM mode, we need unstable_mockModule + dynamic import
jest.unstable_mockModule("../gemini.js", () => ({
  __esModule: true,
  default: geminiMock,
}));

jest.unstable_mockModule("../wardrobe.js", () => ({
  __esModule: true,
  default: wardrobeMock,
}));

// Now import the app AFTER setting up mocks
const { default: app } = await import("../backend.js");

// -----------------------------------------------------------

describe("backend.js routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / should return hi", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("hi");
  });

  test("GET /gemini/response/:user_id/:text calls gemini.main and returns reply", async () => {
    geminiMock.main.mockResolvedValueOnce("mocked reply");

    const res = await request(app).get(
      "/gemini/response/123/hello-world",
    );

    expect(geminiMock.main).toHaveBeenCalledWith("hello-world", "123");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ reply: "mocked reply" });
  });

  test("GET /gemini/parse_cloth/:img_url calls gemini.parse_cloth and returns text", async () => {
    geminiMock.parse_cloth.mockResolvedValueOnce("cloth desc");

    // use a simple URL-safe string to avoid issues with slashes
    const res = await request(app).get(
      "/gemini/parse_cloth/some-image-id",
    );

    expect(geminiMock.parse_cloth).toHaveBeenCalledWith(
      "some-image-id",
    );
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("cloth desc");
  });

  test("POST /wardrobe calls wardrobe.addCloth and returns 201", async () => {
    wardrobeMock.addCloth.mockResolvedValueOnce({});

    const body = { description: "shirt", imgurl: "url", user_id: 1 };

    const res = await request(app).post("/wardrobe").send(body);

    expect(wardrobeMock.addCloth).toHaveBeenCalledWith(body);
    expect(res.statusCode).toBe(201);
    // no body expected
  });

  test("GET /wardrobe/:user_id calls wardrobe.getWardrobe and returns wardrobe data", async () => {
    const mockWardrobe = [
      { description: "shirt", imgurl: "u", user_id: 1 },
    ];
    wardrobeMock.getWardrobe.mockResolvedValueOnce(mockWardrobe);

    const res = await request(app).get("/wardrobe/1");

    expect(wardrobeMock.getWardrobe).toHaveBeenCalledWith("1");
    expect(res.statusCode).toBe(201); // your code uses 201
    expect(res.body).toEqual(mockWardrobe);
  });
});
