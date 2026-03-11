import { jest } from "@jest/globals";
import { Listing } from "../../../src/models/listing.model.js";
import {
  getListings,
  addListing,
  getListingsByUser,
  updateListing,
  deleteListing,
} from "../../../src/services/listing.service.js";

afterEach(() => {
  jest.restoreAllMocks();
});


function mockFind(value) {
  const sortMock = jest.fn().mockResolvedValue(value);
  jest.spyOn(Listing, "find").mockReturnValue({ sort: sortMock });
  return { sortMock };
}


describe("getListings()", () => {
  test("returns array of listings sorted newest first", async () => {
    const expected = [{ _id: "b" }, { _id: "a" }];
    const { sortMock } = mockFind(expected);

    const result = await getListings();

    expect(jest.spyOn(Listing, "find")).toHaveBeenCalledWith();
    expect(sortMock).toHaveBeenCalledWith({ _id: -1 });
    expect(result).toEqual(expected);
  });

  test("returns empty array when no listings exist", async () => {
    mockFind([]);
    expect(await getListings()).toEqual([]);
  });

  test("propagates DB error", async () => {
    const sortMock = jest.fn().mockRejectedValue(new Error("DB error"));
    jest.spyOn(Listing, "find").mockReturnValue({ sort: sortMock });
    await expect(getListings()).rejects.toThrow("DB error");
  });
});


describe("addListing()", () => {
  test("creates and returns new listing", async () => {
    const newListing = { _id: "x", title: "Test Hoodie", price: 50 };
    const createSpy = jest
      .spyOn(Listing, "create")
      .mockResolvedValue(newListing);

    const result = await addListing({ title: "Test Hoodie", price: 50 });

    expect(createSpy).toHaveBeenCalledWith({ title: "Test Hoodie", price: 50 });
    expect(result).toEqual(newListing);
  });

  test("propagates validation error", async () => {
    jest
      .spyOn(Listing, "create")
      .mockRejectedValue(new Error("Validation failed"));
    await expect(addListing({})).rejects.toThrow("Validation failed");
  });
});


describe("getListingsByUser()", () => {
  test("returns listings for specified user", async () => {
    const expected = [{ _id: "1", user_id: "user1" }];
    const findSpy = jest.spyOn(Listing, "find");
    const { sortMock } = mockFind(expected);

    const result = await getListingsByUser("user1");

    expect(findSpy).toHaveBeenCalledWith({ user_id: "user1" });
    expect(sortMock).toHaveBeenCalledWith({ _id: -1 });
    expect(result).toEqual(expected);
  });

  test("returns empty array when user has no listings", async () => {
    mockFind([]);
    expect(await getListingsByUser("unknown-user")).toEqual([]);
  });

  test("propagates DB error", async () => {
    const sortMock = jest.fn().mockRejectedValue(new Error("DB error"));
    jest.spyOn(Listing, "find").mockReturnValue({ sort: sortMock });
    await expect(getListingsByUser("user1")).rejects.toThrow("DB error");
  });
});


describe("updateListing()", () => {
  test("returns updated listing when found", async () => {
    const updated = { _id: "1", title: "Updated" };
    const spy = jest
      .spyOn(Listing, "findByIdAndUpdate")
      .mockResolvedValue(updated);

    const result = await updateListing("1", { title: "Updated" });

    expect(spy).toHaveBeenCalledWith(
      "1",
      { title: "Updated" },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(updated);
  });

  test("returns null when listing not found", async () => {
    jest.spyOn(Listing, "findByIdAndUpdate").mockResolvedValue(null);
    expect(await updateListing("missing", {})).toBeNull();
  });

  test("propagates validation error", async () => {
    jest
      .spyOn(Listing, "findByIdAndUpdate")
      .mockRejectedValue(new Error("Validation error"));
    await expect(updateListing("1", { price: -1 })).rejects.toThrow(
      "Validation error"
    );
  });
});


describe("deleteListing()", () => {
  test("returns deleted listing when found", async () => {
    const deleted = { _id: "1", title: "Hoodie" };
    const spy = jest
      .spyOn(Listing, "findByIdAndDelete")
      .mockResolvedValue(deleted);

    const result = await deleteListing("1");

    expect(spy).toHaveBeenCalledWith("1");
    expect(result).toEqual(deleted);
  });

  test("returns null when listing not found", async () => {
    jest.spyOn(Listing, "findByIdAndDelete").mockResolvedValue(null);
    expect(await deleteListing("missing")).toBeNull();
  });

  test("propagates DB error", async () => {
    jest
      .spyOn(Listing, "findByIdAndDelete")
      .mockRejectedValue(new Error("DB error"));
    await expect(deleteListing("1")).rejects.toThrow("DB error");
  });
});
