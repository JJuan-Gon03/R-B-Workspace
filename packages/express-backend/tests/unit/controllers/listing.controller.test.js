import { jest } from "@jest/globals";

const mockGetListingsService = jest.fn();
const mockAddListing = jest.fn();
const mockGetListingsByUser = jest.fn();
const mockUpdateListing = jest.fn();
const mockDeleteListing = jest.fn();

jest.unstable_mockModule("../../../src/services/listing.service.js", () => ({
  getListings: mockGetListingsService,
  addListing: mockAddListing,
  getListingsByUser: mockGetListingsByUser,
  updateListing: mockUpdateListing,
  deleteListing: mockDeleteListing,
}));

const mockFindById = jest.fn();
jest.unstable_mockModule("../../../src/models/listing.model.js", () => ({
  Listing: { findById: mockFindById },
}));

const mockHandleMongoDBError = jest.fn();
jest.unstable_mockModule("../../../src/db.js", () => ({
  handleMongoDBError: mockHandleMongoDBError,
}));

const {
  getListings,
  postListing,
  getUserListings,
  patchListing,
  deleteListingCtrl,
} = await import("../../../src/controllers/listing.controller.js");

function makeRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("getListings -> success (200)", async () => {
  const listings = [{ _id: "1" }];
  mockGetListingsService.mockResolvedValueOnce(listings);

  const res = makeRes();
  await getListings({}, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(listings);
});

test("getListings -> db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockGetListingsService.mockRejectedValueOnce(error);

  const res = makeRes();
  await getListings({}, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("postListing -> success (201)", async () => {
  const listing = { _id: "1", title: "Hoodie" };
  mockAddListing.mockResolvedValueOnce(listing);

  const req = { body: { title: "Hoodie" } };
  const res = makeRes();
  await postListing(req, res);

  expect(mockAddListing).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.send).toHaveBeenCalledWith(listing);
});

test("postListing -> db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockAddListing.mockRejectedValueOnce(error);

  const req = { body: {} };
  const res = makeRes();
  await postListing(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("getUserListings -> success (200)", async () => {
  const listings = [{ _id: "1", user_id: "user1" }];
  mockGetListingsByUser.mockResolvedValueOnce(listings);

  const req = { params: { user_id: "user1" } };
  const res = makeRes();
  await getUserListings(req, res);

  expect(mockGetListingsByUser).toHaveBeenCalledWith("user1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(listings);
});

test("getUserListings -> db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockGetListingsByUser.mockRejectedValueOnce(error);

  const req = { params: { user_id: "user1" } };
  const res = makeRes();
  await getUserListings(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("patchListing -> listing not found -> 404", async () => {
  mockFindById.mockResolvedValueOnce(null);

  const req = { params: { id: "1" }, body: { user_id: "user1" } };
  const res = makeRes();
  await patchListing(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
});

test("patchListing -> wrong owner -> 403", async () => {
  mockFindById.mockResolvedValueOnce({
    user_id: { toString: () => "owner1" },
  });

  const req = { params: { id: "1" }, body: { user_id: "user2" } };
  const res = makeRes();
  await patchListing(req, res);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("patchListing -> success (200)", async () => {
  const updated = { _id: "1", title: "Updated Hoodie" };
  mockFindById.mockResolvedValueOnce({
    user_id: { toString: () => "user1" },
  });
  mockUpdateListing.mockResolvedValueOnce(updated);

  const req = {
    params: { id: "1" },
    body: { user_id: "user1", title: "Updated Hoodie" },
  };
  const res = makeRes();
  await patchListing(req, res);

  expect(mockUpdateListing).toHaveBeenCalledWith("1", { title: "Updated Hoodie" });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(updated);
});

test("patchListing -> db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockFindById.mockRejectedValueOnce(error);

  const req = { params: { id: "1" }, body: { user_id: "user1" } };
  const res = makeRes();
  await patchListing(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("deleteListingCtrl -> listing not found -> 404", async () => {
  mockFindById.mockResolvedValueOnce(null);

  const req = { params: { id: "1" }, query: { user_id: "user1" } };
  const res = makeRes();
  await deleteListingCtrl(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
});

test("deleteListingCtrl -> wrong owner -> 403", async () => {
  mockFindById.mockResolvedValueOnce({
    user_id: { toString: () => "owner1" },
  });

  const req = { params: { id: "1" }, query: { user_id: "user2" } };
  const res = makeRes();
  await deleteListingCtrl(req, res);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("deleteListingCtrl -> success (200)", async () => {
  mockFindById.mockResolvedValueOnce({
    user_id: { toString: () => "user1" },
  });
  mockDeleteListing.mockResolvedValueOnce();

  const req = { params: { id: "1" }, query: { user_id: "user1" } };
  const res = makeRes();
  await deleteListingCtrl(req, res);

  expect(mockDeleteListing).toHaveBeenCalledWith("1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalled();
});

test("deleteListingCtrl -> db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockFindById.mockRejectedValueOnce(error);

  const req = { params: { id: "1" }, query: { user_id: "user1" } };
  const res = makeRes();
  await deleteListingCtrl(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});
