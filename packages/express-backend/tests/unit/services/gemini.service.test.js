import { jest } from "@jest/globals";

const mockGetClothesByUserId = jest.fn();
jest.unstable_mockModule("../../../src/services/cloth.service.js", () => ({
  getClothesByUserId: mockGetClothesByUserId,
}));

const mockGetTags = jest.fn();
jest.unstable_mockModule("../../../src/services/tag.service.js", () => ({
  getTags: mockGetTags,
}));

const mockGenerateContent = jest.fn();

jest.unstable_mockModule("@google/genai", () => ({
  GoogleGenAI: class {
    constructor() {
      this.models = { generateContent: mockGenerateContent };
    }
  },
}));

const { main, parse_cloth } =
  await import("../../../src/services/gemini.service.js");

beforeEach(() => {
  mockGenerateContent.mockReset();
  mockGetClothesByUserId.mockReset();
  mockGetTags.mockReset();
});

const hoodie_url =
  "https://static.wixstatic.com/media/f690c0_a22d91a4025d4198b900942f1f0e8beb~mv2.jpg/v1/fill/w_480,h_534,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f690c0_a22d91a4025d4198b900942f1f0e8beb~mv2.jpg";

test("parse_cloth()", async () => {
  const expectedText = "description of a hoodie";
  const fakeImageBytes = Buffer.from("fake-image-data");

  global.fetch = jest.fn().mockResolvedValue({
    arrayBuffer: jest.fn().mockResolvedValue(fakeImageBytes.buffer),
    headers: { get: jest.fn().mockReturnValue("image/jpeg") },
  });

  mockGenerateContent.mockResolvedValue({ text: expectedText });
  const result = await parse_cloth(hoodie_url);

  expect(result).toEqual(expectedText);
  expect(global.fetch).toHaveBeenCalledWith(hoodie_url);

  expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  expect(mockGenerateContent).toHaveBeenCalledWith(
    expect.objectContaining({
      contents: expect.arrayContaining([
        expect.objectContaining({
          parts: expect.arrayContaining([
            expect.objectContaining({ inlineData: expect.anything() }),
          ]),
        }),
      ]),
    })
  );
});

test("main()", async () => {
  const clothes = [{ name: "hoodie", img_url: hoodie_url }];
  const tags = [{ name: "tag" }];
  mockGetClothesByUserId.mockResolvedValue(clothes);
  mockGetTags.mockResolvedValue(tags);
  mockGenerateContent.mockResolvedValue({
    text: JSON.stringify({
      text: "this hoodie would be fire for you",
      imgs: [hoodie_url],
    }),
  });

  const prompt1 = "what should i wear?";
  const user_id = 123;

  const result = await main(prompt1, user_id);

  expect(result).toEqual({
    text: "this hoodie would be fire for you",
    imgs: [hoodie_url],
  });

  expect(mockGetClothesByUserId).toHaveBeenCalledTimes(1);
  expect(mockGetClothesByUserId).toHaveBeenCalledWith(user_id);

  expect(mockGetTags).toHaveBeenCalledTimes(1);
  expect(mockGetTags).toHaveBeenCalledWith(user_id);

  expect(mockGenerateContent).toHaveBeenCalledTimes(1);
});

test("parse_cloth() falls back to image/jpeg when content-type header is null", async () => {
  const fakeImageBytes = Buffer.from("fake-image-data");

  global.fetch = jest.fn().mockResolvedValue({
    arrayBuffer: jest.fn().mockResolvedValue(fakeImageBytes.buffer),
    headers: { get: jest.fn().mockReturnValue(null) },
  });

  mockGenerateContent.mockResolvedValue({ text: "a plain jacket" });

  const result = await parse_cloth(hoodie_url);
  expect(result).toBe("a plain jacket");
});

test("parse_cloth() strips charset from content-type (e.g. image/png; charset=utf-8)", async () => {
  const fakeImageBytes = Buffer.from("fake-image-data");

  global.fetch = jest.fn().mockResolvedValue({
    arrayBuffer: jest.fn().mockResolvedValue(fakeImageBytes.buffer),
    headers: { get: jest.fn().mockReturnValue("image/png; charset=utf-8") },
  });

  mockGenerateContent.mockResolvedValue({ text: "a blue jacket" });

  const result = await parse_cloth(hoodie_url);
  expect(result).toBe("a blue jacket");

  // Verify the inlineData sent to Gemini uses the stripped mime type
  const callArgs = mockGenerateContent.mock.calls[0][0];
  const inlinePart = callArgs.contents[0].parts[1];
  expect(inlinePart.inlineData.mimeType).toBe("image/png");
});

test("parse_cloth() trims whitespace from response text", async () => {
  const fakeImageBytes = Buffer.from("fake-image-data");

  global.fetch = jest.fn().mockResolvedValue({
    arrayBuffer: jest.fn().mockResolvedValue(fakeImageBytes.buffer),
    headers: { get: jest.fn().mockReturnValue("image/jpeg") },
  });

  mockGenerateContent.mockResolvedValue({ text: "  INVALID  " });

  const result = await parse_cloth(hoodie_url);
  expect(result).toBe("INVALID");
});

test("parse_cloth() propagates error when fetch fails", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
  await expect(parse_cloth(hoodie_url)).rejects.toThrow("Network error");
});

test("parse_cloth() propagates error when generateContent throws", async () => {
  const fakeImageBytes = Buffer.from("fake-image-data");

  global.fetch = jest.fn().mockResolvedValue({
    arrayBuffer: jest.fn().mockResolvedValue(fakeImageBytes.buffer),
    headers: { get: jest.fn().mockReturnValue("image/jpeg") },
  });

  mockGenerateContent.mockRejectedValue(new Error("Gemini API error"));
  await expect(parse_cloth(hoodie_url)).rejects.toThrow("Gemini API error");
});

test("main() propagates error when getClothesByUserId throws", async () => {
  mockGetClothesByUserId.mockRejectedValue(new Error("DB error"));
  mockGetTags.mockResolvedValue([]);
  await expect(main("any prompt", 1)).rejects.toThrow("DB error");
});

test("main() propagates error when getTags throws", async () => {
  mockGetClothesByUserId.mockResolvedValue([]);
  mockGetTags.mockRejectedValue(new Error("Tags DB error"));
  await expect(main("any prompt", 1)).rejects.toThrow("Tags DB error");
});

test("main() propagates error when generateContent throws", async () => {
  mockGetClothesByUserId.mockResolvedValue([]);
  mockGetTags.mockResolvedValue([]);
  mockGenerateContent.mockRejectedValue(new Error("Gemini API error"));
  await expect(main("any prompt", 1)).rejects.toThrow("Gemini API error");
});

test("main() throws when response.text is not valid JSON", async () => {
  mockGetClothesByUserId.mockResolvedValue([]);
  mockGetTags.mockResolvedValue([]);
  mockGenerateContent.mockResolvedValue({ text: "not-valid-json{{" });
  await expect(main("any prompt", 1)).rejects.toThrow();
});

test("main() throws when response JSON does not match reply schema", async () => {
  mockGetClothesByUserId.mockResolvedValue([]);
  mockGetTags.mockResolvedValue([]);
  // Valid JSON but missing required "text" field → Zod parse fails
  mockGenerateContent.mockResolvedValue({
    text: JSON.stringify({ imgs: [] }),
  });
  await expect(main("any prompt", 1)).rejects.toThrow();
});

test("main() returns reply without imgs when only text is present", async () => {
  mockGetClothesByUserId.mockResolvedValue([]);
  mockGetTags.mockResolvedValue([]);
  mockGenerateContent.mockResolvedValue({
    text: JSON.stringify({ text: "wear something warm" }),
  });

  const result = await main("what should I wear?", 1);
  expect(result).toEqual({ text: "wear something warm" });
});
