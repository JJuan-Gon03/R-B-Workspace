import { jest, describe, beforeEach, test, expect } from "@jest/globals";

// ---- Mocks for wardrobe & preferences -----------------------

const mockGetWardrobe = jest.fn();
const mockGetPreferences = jest.fn();
const mockUpdatePreferences = jest.fn();

jest.unstable_mockModule("../wardrobe.js", () => ({
  __esModule: true,
  default: {
    getWardrobe: mockGetWardrobe,
    addCloth: jest.fn(),
  },
}));

jest.unstable_mockModule("../preferences.js", () => ({
  __esModule: true,
  default: {
    getPreferences: mockGetPreferences,
    updatePreferences: mockUpdatePreferences,
  },
}));

// ---- Mock GoogleGenAI ---------------------------------------

const mockSendMessage = jest.fn();
const mockChatsCreate = jest.fn(() => ({
  sendMessage: mockSendMessage,
}));
const mockGenerateContent = jest.fn();

jest.unstable_mockModule("@google/genai", () => ({
  __esModule: true,
  GoogleGenAI: jest.fn(() => ({
    chats: { create: mockChatsCreate },
    models: { generateContent: mockGenerateContent },
  })),
}));

// Import gemini AFTER all mocks are registered
const { default: gemini } = await import("../gemini.js");

describe("gemini.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("main initializes chat once, calls parse_prefs, and reuses chat on second call", async () => {
    mockGetWardrobe.mockResolvedValue([{ description: "shirt" }]);
    mockGetPreferences.mockResolvedValue("old prefs");

    // parse_prefs uses generateContent
    mockGenerateContent.mockResolvedValue({ text: "new prefs" });

    // chat.sendMessage returns different replies
    mockSendMessage
      .mockResolvedValueOnce({ text: "first reply" })
      .mockResolvedValueOnce({ text: "second reply" });

    const first = await gemini.main("hello", 1);
    const second = await gemini.main("again", 1);

    // chat created only once (branch: !chat and chat already set)
    expect(mockChatsCreate).toHaveBeenCalledTimes(1);
    // wardrobe & prefs for initial system instruction
    expect(mockGetWardrobe).toHaveBeenCalledWith(1);
    expect(mockGetPreferences).toHaveBeenCalledWith(1);

    // parse_prefs called twice => generateContent twice & updatePreferences twice
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockUpdatePreferences).toHaveBeenCalledTimes(2);
    expect(mockUpdatePreferences).toHaveBeenCalledWith({
      preferences: "new prefs",
      user_id: 1,
    });

    expect(first).toBe("first reply");
    expect(second).toBe("second reply");
  });

test("parse_cloth returns description on success", async () => {
  mockGenerateContent.mockResolvedValueOnce({ text: "cloth description" });

  const result = await gemini.parse_cloth("http://img");

  // Don't match the entire string; just the important pieces
  expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  const callArg = mockGenerateContent.mock.calls[0][0];

  expect(callArg).toMatchObject({
    model: "gemini-2.5-flash",
    config: { tools: [{ urlContext: {} }] },
  });

  expect(callArg.contents).toEqual(expect.stringContaining(
    "Generate a detailed description of the clothing item at",
  ));
  expect(callArg.contents).toEqual(expect.stringContaining(
    "Only respond with the description of the clothing item.",
  ));

  expect(result).toBe("cloth description");
});
});
