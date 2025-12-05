import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import request from "supertest";

// ---- Mocks for gemini & wardrobe (ESM!) ------------------------

const geminiMain = jest.fn();
const geminiParseCloth = jest.fn();

const wardrobeAddCloth = jest.fn();
const wardrobeGetWardrobe = jest.fn();

jest.unstable_mockModule("../gemini.js", () => ({
  __esModule: true,
  default: {
    main: geminiMain,
    parse_cloth: geminiParseCloth,
  },
}));

jest.unstable_mockModule("../wardrobe.js", () => ({
  __esModule: true,
  default: {
    getWardrobe: wardrobeGetWardrobe,
    addCloth: wardrobeAddCloth,
  },
}));

// Import app AFTER mocks are set up
const { default: app } = await import("../backend.js");

// ---------------------------------------------------------------

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
    geminiMain.mockResolvedValueOnce("mocked reply");

    const res = await request(app).get("/gemini/response/123/hello-world");

    expect(geminiMain).toHaveBeenCalledWith("hello-world", "123");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ reply: "mocked reply" });
  });

  test("GET /gemini/parse_cloth/:img_url calls gemini.parse_cloth and returns text", async () => {
    geminiParseCloth.mockResolvedValueOnce("cloth desc");

    const res = await request(app).get("/gemini/parse_cloth/some-image-id");

    expect(geminiParseCloth).toHaveBeenCalledWith("some-image-id");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("cloth desc");
  });

  test("POST /wardrobe calls wardrobe.addCloth and returns 201", async () => {
    wardrobeAddCloth.mockResolvedValueOnce({});

    const body = { description: "shirt", imgurl: "url", user_id: 1 };

    const res = await request(app).post("/wardrobe").send(body);

    expect(wardrobeAddCloth).toHaveBeenCalledWith(body);
    expect(res.statusCode).toBe(201);
  });

  test("GET /wardrobe/:user_id calls wardrobe.getWardrobe and returns wardrobe data", async () => {
    const mockWardrobe = [
      { description: "jeans", imgurl: "u", user_id: 1 },
    ];
    wardrobeGetWardrobe.mockResolvedValueOnce(mockWardrobe);

    const res = await request(app).get("/wardrobe/1");

    expect(wardrobeGetWardrobe).toHaveBeenCalledWith("1");
    expect(res.statusCode).toBe(201); // matches backend.js
    expect(res.body).toEqual(mockWardrobe);
  });
});
