import { jest } from "@jest/globals";
import { User } from "../../../src/models/user.model.js";
import { getByUsername, addUser } from "../../../src/services/user.service.js";

afterEach(() => jest.restoreAllMocks());

test("getByUsername", async () => {
  const expected_result = { username: "username", password: "password" };
  const findSpy = jest
    .spyOn(User, "findOne")
    .mockResolvedValue(expected_result);

  const username = "username";
  const actual_result = await getByUsername(username);

  expect(findSpy).toHaveBeenCalledWith({ username: username });
  expect(actual_result).toEqual(expected_result);
});

test("addUser", async () => {
  const expected_result = { username: "username", password: "password" };
  const findSpy = jest.spyOn(User, "create").mockResolvedValue(expected_result);

  const user = { username: "username", password: "password" };
  const actual_result = await addUser(user);

  expect(findSpy).toHaveBeenCalledWith(user);
  expect(actual_result).toEqual(expected_result);
});
