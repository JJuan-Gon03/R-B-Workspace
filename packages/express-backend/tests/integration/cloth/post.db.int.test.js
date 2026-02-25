import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mockParseCloth = jest.fn();
jest.unstable_mockModule("../../../src/services/gemini.service.js", () => ({
  parse_cloth: mockParseCloth,
  main: jest.fn(),
}));

const { app } = await import("../../../src/app.js");
const { Cloth } = await import("../../../src/models/cloth.model.js");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { dbName: "testCloth" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("POST /clothes", async () => {
  mockParseCloth.mockResolvedValueOnce("description");

  const userId = new mongoose.Types.ObjectId();

  const reqBody = {
    user_id: userId,
    name: "name",
    color: "color",
    type: "type",
    tags: [],
    img_url: "img_url",
    public_id: "public_id",
  };
  const resBody = {
    user_id: userId.toString(),
    name: "name",
    color: "color",
    type: "type",
    tags: [],
    img_url: "img_url",
    public_id: "public_id",
    description: "description",
  };

  const res = await request(app).post("/wardrobe").send(reqBody);

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject(resBody);

  const docs = await Cloth.find({ user_id: userId }).lean();
  expect(docs).toHaveLength(1);
  expect(docs[0]).toMatchObject(resBody);
});
