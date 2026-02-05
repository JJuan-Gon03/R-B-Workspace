import { jest } from "@jest/globals";

const mockAddTag = jest.fn();
const mockGetTags = jest.fn();
const mockRemoveTagById = jest.fn();
const mockRemoveTagFromClothes = jest.fn();

jest.unstable_mockModule("../../../src/services/tag.service.js", () => ({
  addTag: mockAddTag,
  getTags: mockGetTags,
  removeTagById: mockRemoveTagById,
}));

jest.unstable_mockModule("../../../src/services/cloth.service.js",()=>({
    removeTagFromClothes: mockRemoveTagFromClothes,
}))

const mockHandleMongoDBError=jest.fn();
jest.unstable_mockModule("../../../src/db.js", () => ({
  handleMongoDBError: mockHandleMongoDBError
}));

const { postTag, getTagsForUser, deleteTag } = await import(
  "../../../src/controllers/tag.controller.js"
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

const test_tag = { _id: 123, name: "test_tag", user_id: 123 };

test("posting a tag", async () => {
  mockAddTag.mockResolvedValueOnce(test_tag);

  const tag = { name: "name", user_id: 123 };
  const req = { body: tag };
  const res = makeRes();

  await postTag(req, res);

  expect(mockAddTag).toHaveBeenCalledWith(tag);
  expect(res.status).toHaveBeenLastCalledWith(201);
  expect(res.send).toHaveBeenCalledWith(test_tag);
});

test("posting a tag with error", async () => {
  const error=new Error("error")
  mockAddTag.mockRejectedValueOnce(error)

  const tag = { name: "name", user_id: 123 };
  const req = { body: tag };
  const res = makeRes();

  await postTag(req, res);

  expect(mockAddTag).toHaveBeenCalledWith(tag);
  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res,error)
});

test("getting tags", async () => {
  mockGetTags.mockResolvedValueOnce([test_tag]);

  const req = { params: {user_id: 123} };
  const res = makeRes();

  await getTagsForUser(req, res);

  expect(mockGetTags).toHaveBeenCalledWith(req.params.user_id);
  expect(res.status).toHaveBeenLastCalledWith(200);
  expect(res.send).toHaveBeenCalledWith([test_tag]);
});

test("getting tags with error", async () => {
  const error=new Error("error")
  mockGetTags.mockRejectedValueOnce(error)

  const req = { params: {user_id: 123} };
  const res = makeRes();

  await getTagsForUser(req, res);

  expect(mockGetTags).toHaveBeenCalledWith(req.params.user_id);
  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res,error)
});

test("deleting tag", async () => {
  const req = { params: {tagId: 123} };
  const res = makeRes();

  await deleteTag(req, res);

  expect(mockRemoveTagById).toHaveBeenCalledWith(req.params.tagId);
  expect(mockRemoveTagFromClothes).toHaveBeenCalledWith(req.params.tagId);
  expect(res.status).toHaveBeenLastCalledWith(200);
});

test("deleting tag with error", async () => {
  const error=new Error("error")
  mockRemoveTagById.mockRejectedValueOnce(error)

  const req = { params: {tagId: 123} };
  const res = makeRes();

  await deleteTag(req, res);

  expect(mockRemoveTagById).toHaveBeenCalledWith(req.params.tagId);
  expect(mockRemoveTagFromClothes).not.toHaveBeenCalled();
  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res,error)
});
