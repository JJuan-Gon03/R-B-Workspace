import { jest } from "@jest/globals";
import { Tag } from "../../../src/models/tag.model.js";
import {
  getTags,
  addTag,
  removeTagById,
} from "../../../src/services/tag.service.js";

const expected_result = [{ test_value: "test_value" }];

afterEach(() => jest.restoreAllMocks());

test("get tags by user id", async () => {
  const findSpy = jest.spyOn(Tag, "find").mockResolvedValue(expected_result);

  const user_id = 123;
  const actual_result = await getTags(user_id);

  expect(findSpy).toHaveBeenCalledWith({ user_id: user_id });
  expect(actual_result).toEqual(expected_result);
});

test("adding a tag", async () => {
  const createSpy = jest
    .spyOn(Tag, "create")
    .mockResolvedValue(expected_result);

  const tag = { user_id: 123, name: "test_value" };
  const actual_result = await addTag(tag);

  expect(createSpy).toHaveBeenCalledWith(tag);
  expect(actual_result).toEqual(expected_result);
});

test("removing a tag by id", async () => {
  const removeSpy = jest
    .spyOn(Tag, "findByIdAndDelete")
    .mockResolvedValue(expected_result);

  const tagId = 123;
  const actual_result = await removeTagById(tagId);

  expect(removeSpy).toHaveBeenCalledWith(tagId);
  expect(actual_result).toEqual(expected_result);
});
