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

const { main, parse_cloth } = await import(
  "../../../src/services/gemini.service.js"
);

beforeEach(() => {
  mockGenerateContent.mockReset();
  mockGetClothesByUserId.mockReset();
  mockGetTags.mockReset();
});

const hoodie_url =
  "https://static.wixstatic.com/media/f690c0_a22d91a4025d4198b900942f1f0e8beb~mv2.jpg/v1/fill/w_480,h_534,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f690c0_a22d91a4025d4198b900942f1f0e8beb~mv2.jpg";

test("parse_cloth()", async () => {
  const expectedText = "description of a hoodie";

  mockGenerateContent.mockResolvedValue({ text: expectedText });
  const result = await parse_cloth(hoodie_url);

  expect(result).toEqual(expectedText);

  expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  expect(mockGenerateContent).toHaveBeenCalledWith(
    expect.objectContaining({
      contents: expect.stringContaining(hoodie_url),
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
