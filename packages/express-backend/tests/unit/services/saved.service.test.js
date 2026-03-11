import { jest } from "@jest/globals";
import { Saved } from "../../../src/models/saved.model.js";
import {
  getSaved,
  saveListing,
  unsaveListing,
} from "../../../src/services/saved.service.js";

afterEach(() => {
  jest.restoreAllMocks();
});


function mockFindChain(resolvedValue) {
  const sortMock = jest.fn().mockResolvedValue(resolvedValue);
  const populateMock = jest.fn().mockReturnValue({ sort: sortMock });
  jest.spyOn(Saved, "find").mockReturnValue({ populate: populateMock });
  return { populateMock, sortMock };
}


describe("getSaved()", () => {
  test("returns populated saved listings sorted by savedAt desc", async () => {
    const expected = [{ _id: "s1", listing_id: { _id: "l1", title: "Hoodie" } }];
    const findSpy = jest.spyOn(Saved, "find");
    const { populateMock, sortMock } = mockFindChain(expected);

    const result = await getSaved("user1");

    expect(findSpy).toHaveBeenCalledWith({ user_id: "user1" });
    expect(populateMock).toHaveBeenCalledWith("listing_id");
    expect(sortMock).toHaveBeenCalledWith({ savedAt: -1 });
    expect(result).toEqual(expected);
  });

  test("returns empty array when user has no saved listings", async () => {
    mockFindChain([]);
    expect(await getSaved("user-no-saves")).toEqual([]);
  });

  test("propagates DB error", async () => {
    const sortMock = jest.fn().mockRejectedValue(new Error("DB error"));
    const populateMock = jest.fn().mockReturnValue({ sort: sortMock });
    jest.spyOn(Saved, "find").mockReturnValue({ populate: populateMock });

    await expect(getSaved("user1")).rejects.toThrow("DB error");
  });
});


describe("saveListing()", () => {
  test("creates and returns saved document", async () => {
    const doc = { _id: "s1", user_id: "user1", listing_id: "l1" };
    const createSpy = jest.spyOn(Saved, "create").mockResolvedValue(doc);

    const result = await saveListing("user1", "l1");

    expect(createSpy).toHaveBeenCalledWith({
      user_id: "user1",
      listing_id: "l1",
    });
    expect(result).toEqual(doc);
  });

  test("propagates duplicate key error (code 11000) for re-saves", async () => {
    const dupError = Object.assign(new Error("Duplicate"), { code: 11000 });
    jest.spyOn(Saved, "create").mockRejectedValue(dupError);

    const err = await saveListing("user1", "l1").catch((e) => e);
    expect(err.code).toBe(11000);
  });

  test("propagates general DB error", async () => {
    jest.spyOn(Saved, "create").mockRejectedValue(new Error("DB error"));
    await expect(saveListing("user1", "l1")).rejects.toThrow("DB error");
  });
});


describe("unsaveListing()", () => {
  test("returns deleted document when save record exists", async () => {
    const deleted = { _id: "s1", user_id: "user1", listing_id: "l1" };
    const spy = jest
      .spyOn(Saved, "findOneAndDelete")
      .mockResolvedValue(deleted);

    const result = await unsaveListing("user1", "l1");

    expect(spy).toHaveBeenCalledWith({
      user_id: "user1",
      listing_id: "l1",
    });
    expect(result).toEqual(deleted);
  });

  test("returns null when save record does not exist", async () => {
    jest.spyOn(Saved, "findOneAndDelete").mockResolvedValue(null);
    expect(await unsaveListing("user1", "nonexistent")).toBeNull();
  });

  test("propagates DB error", async () => {
    jest
      .spyOn(Saved, "findOneAndDelete")
      .mockRejectedValue(new Error("DB error"));
    await expect(unsaveListing("user1", "l1")).rejects.toThrow("DB error");
  });
});
