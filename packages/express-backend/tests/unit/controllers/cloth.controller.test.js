import { jest } from "@jest/globals";

const mockGetClothesByUserId = jest.fn().mockResolvedValue();
const mockAddCloth = jest.fn();
const mockRemoveClothById = jest.fn();
const mockGetPublicId = jest.fn();

jest.unstable_mockModule("../../../src/services/cloth.service.js", () => ({
  getClothesByUserId: mockGetClothesByUserId,
  addCloth: mockAddCloth,
  removeClothById: mockRemoveClothById,
  getPublicId: mockGetPublicId,
}));

const mockHandleMongoDBError = jest.fn();
jest.unstable_mockModule("../../../src/db.js", () => ({
  handleMongoDBError: mockHandleMongoDBError,
}));

const mockParseCloth = jest.fn();
const mockMain = jest.fn();
jest.unstable_mockModule("../../../src/services/gemini.service.js", () => ({
  parse_cloth: mockParseCloth,
  main: mockMain,
}));

const mockDeleteImageFromCloudinary = jest.fn();
jest.unstable_mockModule("../../../src/services/cloudinary.service.js", () => ({
  delete_image_from_cloudinary: mockDeleteImageFromCloudinary,
}));

const { postCloth, getClothes, deleteCloth } = await import(
  "../../../src/controllers/cloth.controller.js"
);

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

test("postCloth -> invalid photo", async () => {
  mockParseCloth.mockResolvedValueOnce("INVALID");

  const req = { body: { img_url: "imgurl" } };
  const res = makeRes();

  await postCloth(req, res);

  expect(mockParseCloth).toHaveBeenCalledWith(req.body.img_url);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: "invalid image for upload",
  });
});

test("postCloth -> gemini parse cloth error", async () => {
  mockParseCloth.mockRejectedValueOnce(new Error("error"));

  const req = { body: { img_url: "imgurl" } };
  const res = makeRes();

  await postCloth(req, res);

  expect(mockParseCloth).toHaveBeenCalledWith(req.body.img_url);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "server error",
  });
});

test("postCloth -> parseCloth success -> addCloth error", async () => {
  const error = new Error("error");
  mockAddCloth.mockRejectedValueOnce(error);

  const req = { body: { img_url: "imgurl" } };
  const res = makeRes();

  await postCloth(req, res);

  expect(mockParseCloth).toHaveBeenCalledWith(req.body.img_url);
  expect(mockAddCloth).toHaveBeenCalledWith(req.body);
  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("postCloth -> parseCloth success -> addCloth success -> gemini main success -> return success", async () => {
  mockParseCloth.mockResolvedValueOnce("description");

  const req = { body: { img_url: "imgurl", user_id: 123 } };
  const res = makeRes();

  await postCloth(req, res);

  expect(mockParseCloth).toHaveBeenCalledWith(req.body.img_url);
  expect(mockAddCloth).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.send).toHaveBeenCalledWith(req.body);
  expect(req.body).toEqual({
    img_url: "imgurl",
    user_id: 123,
    description: "description",
  });
});

test("getClothes -> getClothesByUserId error", async () => {
  const error = new Error("error");
  mockGetClothesByUserId.mockRejectedValueOnce(error);

  const req = { params: { user_id: 123 } };
  const res = makeRes();

  await getClothes(req, res);

  expect(mockGetClothesByUserId).toHaveBeenCalledWith(req.params.user_id);
  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("getClothes -> getClothesByUserId success -> return success", async () => {
  const wd = {};
  mockGetClothesByUserId.mockResolvedValueOnce(wd);

  const req = { params: { user_id: 123 } };
  const res = makeRes();

  await getClothes(req, res);

  expect(mockGetClothesByUserId).toHaveBeenCalledWith(req.params.user_id);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(wd);
});

test("deleteCloth -> getPublicId error", async () => {
  const error = new Error("error");

  mockGetPublicId.mockRejectedValueOnce(error);

  const req = { params: { clothId: 123 } };
  const res = makeRes();

  await deleteCloth(req, res);

  expect(mockGetPublicId).toHaveBeenCalledWith(req.params.clothId);
  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("deleteCloth -> cloudinary delete error", async () => {
  const publicId = 123;

  mockGetPublicId.mockResolvedValueOnce(publicId);
  mockDeleteImageFromCloudinary.mockRejectedValueOnce(new Error("error"));

  const req = { params: { clothId: 123 } };
  const res = makeRes();

  await deleteCloth(req, res);

  expect(mockGetPublicId).toHaveBeenCalledWith(req.params.clothId);
  expect(mockDeleteImageFromCloudinary).toHaveBeenCalledWith(publicId);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "error deleting image from cloudinary",
  });
});

test("deleteCloth -> removeClothById error", async () => {
  const publicId = 123;
  const error = new Error("error");

  mockGetPublicId.mockResolvedValueOnce(publicId);
  mockRemoveClothById.mockRejectedValueOnce(error);

  const req = { params: { clothId: 123 } };
  const res = makeRes();

  await deleteCloth(req, res);

  expect(mockGetPublicId).toHaveBeenCalledWith(req.params.clothId);
  expect(mockDeleteImageFromCloudinary).toHaveBeenCalledWith(publicId);
  expect(mockRemoveClothById).toHaveBeenCalledWith(req.params.clothId);
  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("deleteCloth -> success", async () => {
  const publicId = 123;
  const deletedCloth = { user_id: 123 };

  mockGetPublicId.mockResolvedValueOnce(publicId);
  mockRemoveClothById.mockResolvedValueOnce(deletedCloth);

  const req = { params: { clothId: 123 } };
  const res = makeRes();

  await deleteCloth(req, res);

  expect(mockGetPublicId).toHaveBeenCalledWith(req.params.clothId);
  expect(mockDeleteImageFromCloudinary).toHaveBeenCalledWith(publicId);
  expect(mockRemoveClothById).toHaveBeenCalledWith(req.params.clothId);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalled();
});
