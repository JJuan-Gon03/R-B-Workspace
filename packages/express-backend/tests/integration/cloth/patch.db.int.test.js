import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.unstable_mockModule("../../../src/services/gemini.service.js", () => ({
  parse_cloth: jest.fn(),
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

test("PATCH /Clothes", async () => {
  const userId = new mongoose.Types.ObjectId();
  const clothData = {
    user_id: userId,
    name: "cloth",
    color: "color",
    type: "type",
    tags: [],
    description: "description",
    img_url: "img_url",
    public_id: "public_id",
  };
  const cloth = await Cloth.create(clothData);

  const reqBody = {
    name: "new name",
    color: "new color",
  };

  const expectedCloth = cloth.toObject();
  expectedCloth._id = expectedCloth._id.toString();
  expectedCloth.user_id = expectedCloth.user_id.toString();
  expectedCloth.name = reqBody.name;
  expectedCloth.color = reqBody.color;

  const res = await request(app)
    .patch("/wardrobe/" + cloth._id)
    .send(reqBody);

  expect(res.status).toBe(200);

  const resultCloth = res.body;
  console.log(resultCloth);
  console.log(expectedCloth);
  console.log(process.env.MONGO_URI);
  expect(resultCloth).toEqual(expectedCloth);
});
