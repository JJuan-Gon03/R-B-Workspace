import { jest } from "@jest/globals";

const mockGetSavedService = jest.fn();
const mockSaveListing = jest.fn();
const mockUnsaveListing = jest.fn();

jest.unstable_mockModule("../../../src/services/saved.service.js", () => ({
  getSaved: mockGetSavedService,
  saveListing: mockSaveListing,
  unsaveListing: mockUnsaveListing,
}));

const mockHandleMongoDBError = jest.fn();
jest.unstable_mockModule("../../../src/db.js", () => ({
  handleMongoDBError: mockHandleMongoDBError,
}));

const { getSaved, postSaved, deleteSaved } =
  await import("../../../src/controllers/saved.controller.js");

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

test("getSaved -> success (200)", async () => {
  const saved = [{ _id: "1", listing_id: "listing1" }];
  mockGetSavedService.mockResolvedValueOnce(saved);

  const req = { params: { user_id: "user1" } };
  const res = makeRes();
  await getSaved(req, res);

  expect(mockGetSavedService).toHaveBeenCalledWith("user1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(saved);
});

test("getSaved -> db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockGetSavedService.mockRejectedValueOnce(error);

  const req = { params: { user_id: "user1" } };
  const res = makeRes();
  await getSaved(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("postSaved -> success (201)", async () => {
  const saved = { _id: "1", user_id: "user1", listing_id: "listing1" };
  mockSaveListing.mockResolvedValueOnce(saved);

  const req = { body: { user_id: "user1", listing_id: "listing1" } };
  const res = makeRes();
  await postSaved(req, res);

  expect(mockSaveListing).toHaveBeenCalledWith("user1", "listing1");
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.send).toHaveBeenCalledWith(saved);
});

test("postSaved -> duplicate key error (11000) -> already saved (200)", async () => {
  const error = { code: 11000 };
  mockSaveListing.mockRejectedValueOnce(error);

  const req = { body: { user_id: "user1", listing_id: "listing1" } };
  const res = makeRes();
  await postSaved(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: "already saved" });
});

test("postSaved -> generic db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockSaveListing.mockRejectedValueOnce(error);

  const req = { body: { user_id: "user1", listing_id: "listing1" } };
  const res = makeRes();
  await postSaved(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("deleteSaved -> success (200)", async () => {
  mockUnsaveListing.mockResolvedValueOnce();

  const req = { params: { user_id: "user1", listing_id: "listing1" } };
  const res = makeRes();
  await deleteSaved(req, res);

  expect(mockUnsaveListing).toHaveBeenCalledWith("user1", "listing1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalled();
});

test("deleteSaved -> db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockUnsaveListing.mockRejectedValueOnce(error);

  const req = { params: { user_id: "user1", listing_id: "listing1" } };
  const res = makeRes();
  await deleteSaved(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});
