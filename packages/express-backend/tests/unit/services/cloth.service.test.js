import { jest } from "@jest/globals";
import { Cloth } from "../../../src/models/cloth.model.js";
import {
  getClothesByUserId,
  addCloth,
  removeClothById,
  removeTagFromClothes,
  getPublicId
} from "../../../src/services/cloth.service.js";

const expected_result = [{ test_value: "test_value" }];

test("get clothes by user id", async () => {
  const findSpy = jest.spyOn(Cloth, "find").mockResolvedValue(expected_result);

  const user_id = 123;
  const actual_result = await getClothesByUserId(user_id);

  expect(findSpy).toHaveBeenCalledWith({ user_id: user_id });
  expect(actual_result).toEqual(expected_result);
});

test("add cloth", async () => {
  const createSpy = jest
    .spyOn(Cloth, "create")
    .mockResolvedValue(expected_result);

  const cloth = {};
  const actual_result = await addCloth(cloth);

  expect(createSpy).toHaveBeenCalledWith(cloth);
  expect(actual_result).toEqual(expected_result);
});

test("remove cloth by id", async () => {
  const findAndDeleteSpy = jest
    .spyOn(Cloth, "findByIdAndDelete")
    .mockResolvedValue(expected_result);

  const cloth_id = 123;
  const actual_result = await removeClothById(cloth_id);

  expect(findAndDeleteSpy).toHaveBeenCalledWith(cloth_id);
  expect(actual_result).toEqual(expected_result);
});

test("remove tag from clothes", async () => {
  const updateSpy = jest
    .spyOn(Cloth, "updateMany")
    .mockResolvedValue(expected_result);

  const tag_id = 123;
  const actual_result = await removeTagFromClothes(tag_id);

  expect(updateSpy).toHaveBeenCalledWith(
    { tags: tag_id },
    { $pull: { tags: tag_id } }
  );
  expect(actual_result).toEqual(expected_result);
});

test("get public id", async () => {
  const cloth={public_id: 123}
  const findSpy = jest
    .spyOn(Cloth, "findById")
    .mockResolvedValue(cloth);

  const cloth_id = 123;
  const result = await getPublicId(cloth_id);

  expect(findSpy).toHaveBeenCalledWith(cloth_id);
  expect(result).toEqual(cloth.public_id);
});
