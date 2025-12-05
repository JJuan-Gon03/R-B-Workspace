import { jest, describe, beforeEach, test, expect } from "@jest/globals";

// shared mocks for model methods
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockUpdateOne = jest.fn();

// mock mongoose BEFORE importing preferences.js
jest.unstable_mockModule("mongoose", () => {
  const mongooseMock = {
    Schema: jest.fn(function () {}),
    model: jest.fn(() => ({
      findOne: mockFindOne,
      create: mockCreate,
      updateOne: mockUpdateOne,
    })),
    set: jest.fn(),
    connect: jest.fn(() => ({
      catch: (handler) => {
        // simulate a connection error so the `.catch(...)` arrow in preferences.js runs
        handler(new Error("connection error (test)"));
      },
    })),
  };

  return {
    __esModule: true,
    default: mongooseMock,
  };
});

const { default: preferences } = await import("../preferences.js");

describe("preferences.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getPreferences delegates to Pref.findOne and returns result", async () => {
    const fakePref = { preferences: "dark aesthetic", user_id: 1 };
    mockFindOne.mockResolvedValueOnce(fakePref);

    const result = await preferences.getPreferences(1);

    expect(mockFindOne).toHaveBeenCalledWith({ user_id: 1 });
    expect(result).toBe(fakePref);
  });

  test("updatePreferences creates new pref when none exists", async () => {
    const pref = { preferences: "streetwear", user_id: 2 };

    mockFindOne.mockResolvedValueOnce(null); // no existing
    const created = { ...pref, _id: "abc" };
    mockCreate.mockResolvedValueOnce(created);

    const result = await preferences.updatePreferences(pref);

    expect(mockFindOne).toHaveBeenCalledWith({ user_id: pref.user_id });
    expect(mockCreate).toHaveBeenCalledWith(pref);
    expect(result).toBe(created);
  });

  test("updatePreferences updates existing pref when found", async () => {
    const pref = { preferences: "formal", user_id: 3 };
    const existing = { preferences: "old", user_id: 3 };

    mockFindOne.mockResolvedValueOnce(existing);
    const updateRes = { acknowledged: true };
    mockUpdateOne.mockResolvedValueOnce(updateRes);

    const result = await preferences.updatePreferences(pref);

    expect(mockFindOne).toHaveBeenCalledWith({ user_id: pref.user_id });
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { user_id: pref.user_id },
      { $set: pref },
    );
    expect(result).toBe(updateRes);
  });

  test("updatePreferences logs on create error and resolves undefined", async () => {
    const pref = { preferences: "casual", user_id: 4 };
    const error = new Error("create failed");

    mockFindOne.mockResolvedValueOnce(null);
    mockCreate.mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    const result = await preferences.updatePreferences(pref);

    expect(mockCreate).toHaveBeenCalledWith(pref);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("error creating pref:"),
      error,
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
