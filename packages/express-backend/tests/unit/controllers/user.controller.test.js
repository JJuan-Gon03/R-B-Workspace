import { jest } from "@jest/globals";

const mockGetByUsername = jest.fn();
const mockAddUser = jest.fn();

jest.unstable_mockModule("../../../src/services/user.service.js", () => ({
  getByUsername: mockGetByUsername,
  addUser: mockAddUser,
}));

const mockHandleMongoDBError = jest.fn();
jest.unstable_mockModule("../../../src/db.js", () => ({
  handleMongoDBError: mockHandleMongoDBError,
}));

const mockBcryptHash = jest.fn().mockResolvedValue("hashedpassword");
const mockBcryptCompare = jest.fn();
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: mockBcryptHash,
    compare: mockBcryptCompare,
  },
}));

const { postUser, login } =
  await import("../../../src/controllers/user.controller.js");

function makeRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockBcryptHash.mockResolvedValue("hashedpassword");
});

test("postUser -> missing password -> 400", async () => {
  const req = { body: { username: "user1" } };
  const res = makeRes();
  await postUser(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockGetByUsername).not.toHaveBeenCalled();
});

test("postUser -> missing username -> 400", async () => {
  const req = { body: { password: "pass" } };
  const res = makeRes();
  await postUser(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockGetByUsername).not.toHaveBeenCalled();
});

test("postUser -> getByUsername db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockGetByUsername.mockRejectedValueOnce(error);

  const req = { body: { username: "user1", password: "pass" } };
  const res = makeRes();
  await postUser(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("postUser -> username already taken -> 409", async () => {
  mockGetByUsername.mockResolvedValueOnce({ _id: "1", username: "user1" });

  const req = { body: { username: "user1", password: "pass" } };
  const res = makeRes();
  await postUser(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: "username has already been taken" })
  );
});

test("postUser -> addUser db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockGetByUsername.mockResolvedValueOnce(null);
  mockAddUser.mockRejectedValueOnce(error);

  const req = { body: { username: "user1", password: "pass" } };
  const res = makeRes();
  await postUser(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("postUser -> success (201)", async () => {
  mockGetByUsername.mockResolvedValueOnce(null);
  mockAddUser.mockResolvedValueOnce({ _id: "newUserId" });

  const req = { body: { username: "user1", password: "pass" } };
  const res = makeRes();
  await postUser(req, res);

  expect(mockBcryptHash).toHaveBeenCalledWith("pass", 10);
  expect(mockAddUser).toHaveBeenCalledWith({
    username: "user1",
    password: "hashedpassword",
  });
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.send).toHaveBeenCalledWith("newUserId");
});

test("login -> missing password -> 400", async () => {
  const req = { body: { username: "user1" } };
  const res = makeRes();
  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockGetByUsername).not.toHaveBeenCalled();
});

test("login -> missing username -> 400", async () => {
  const req = { body: { password: "pass" } };
  const res = makeRes();
  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockGetByUsername).not.toHaveBeenCalled();
});

test("login -> getByUsername db error -> handleMongoDBError", async () => {
  const error = new Error("db error");
  mockGetByUsername.mockRejectedValueOnce(error);

  const req = { body: { username: "user1", password: "pass" } };
  const res = makeRes();
  await login(req, res);

  expect(mockHandleMongoDBError).toHaveBeenCalledWith(res, error);
});

test("login -> user not found -> 400", async () => {
  mockGetByUsername.mockResolvedValueOnce(null);

  const req = { body: { username: "user1", password: "pass" } };
  const res = makeRes();
  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ name: "invalid username" })
  );
});

test("login -> wrong password -> 400", async () => {
  mockGetByUsername.mockResolvedValueOnce({
    _id: "userId",
    password: "hashedpass",
  });
  mockBcryptCompare.mockResolvedValueOnce(false);

  const req = { body: { username: "user1", password: "wrongpass" } };
  const res = makeRes();
  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ name: "invalid password" })
  );
});

test("login -> success (200)", async () => {
  mockGetByUsername.mockResolvedValueOnce({
    _id: "userId",
    password: "hashedpass",
  });
  mockBcryptCompare.mockResolvedValueOnce(true);

  const req = { body: { username: "user1", password: "correctpass" } };
  const res = makeRes();
  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith("userId");
});
