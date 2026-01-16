import { jest } from "@jest/globals";

const mockGetWardrobe = jest.fn();
jest.unstable_mockModule("../wardrobe.js", () => ({
  default: { getWardrobe: mockGetWardrobe },
}));

const mockSendMessage = jest.fn();
const mockChatsCreate = jest.fn(() => ({
  sendMessage: mockSendMessage,
}));

const mockGenerateContent=jest.fn();

jest.unstable_mockModule("@google/genai", () => ({
  GoogleGenAI: class {
    constructor() {
      this.chats = { create: mockChatsCreate };
      this.models={generateContent: mockGenerateContent}
    }
  },
}));

const geminiModule = await import("../gemini.js");
const gemini = geminiModule.default;

beforeEach(() => {
  mockGetWardrobe.mockReset();
  mockSendMessage.mockReset();
  mockChatsCreate.mockClear();
  gemini.resetChat();
});

const hoodie_url =
  "https://static.wixstatic.com/media/f690c0_a22d91a4025d4198b900942f1f0e8beb~mv2.jpg/v1/fill/w_480,h_534,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f690c0_a22d91a4025d4198b900942f1f0e8beb~mv2.jpg";

test("parse_cloth()", async()=>{
  const expectedText="description of a hoodie"

  mockGenerateContent.mockResolvedValue({text:expectedText})
  const result=await gemini.parse_cloth(hoodie_url)

  expect(result).toEqual(expectedText)

  expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  expect(mockGenerateContent).toHaveBeenCalledWith(
    expect.objectContaining({
      contents: expect.stringContaining(hoodie_url),
    })
  );
})

test("main(): first call; create chat, send prompt, return reply", async () => {
  mockGetWardrobe.mockResolvedValue([{ name: "hoodie", img_url: hoodie_url }]);
  mockSendMessage.mockResolvedValue({
    text: JSON.stringify({
      text: "this hoodie would be fire for you",
      imgs: [hoodie_url],
    }),
  });

  const prompt1 = "what should i wear?";
  const prompt2 = "what should i wear again?";
  const user_id=123

  const result = await gemini.main(prompt1, user_id);
  const result2 = await gemini.main(prompt2, user_id);

  expect(result).toEqual({
    text: "this hoodie would be fire for you",
    imgs: [hoodie_url],
  });
  expect(result2).toEqual({
    text: "this hoodie would be fire for you",
    imgs: [hoodie_url],
  });

  expect(mockGetWardrobe).toHaveBeenCalledTimes(1);
  expect(mockGetWardrobe).toHaveBeenCalledWith(user_id);
  expect(mockChatsCreate).toHaveBeenCalledTimes(1);

  expect(mockSendMessage).toHaveBeenCalledTimes(2);
  expect(mockSendMessage).toHaveBeenNthCalledWith(1, { message: prompt1 });
  expect(mockSendMessage).toHaveBeenNthCalledWith(2, { message: prompt2 });
});
