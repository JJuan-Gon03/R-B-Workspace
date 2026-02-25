import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mockDeleteImageFromCloudinary = jest.fn();
jest.unstable_mockModule("../../../src/services/cloudinary.service.js", () => ({
  delete_image_from_cloudinary: mockDeleteImageFromCloudinary,
}));

//have this cus azure screaming at me for its env vars
jest.unstable_mockModule("../../../src/services/gemini.service.js", () => ({
  parse_cloth: jest.fn(),
  main: jest.fn(),
}));

const { app } = await import("../../../src/app.js");
const { Cloth } = await import("../../../src/models/cloth.model.js");

let mongo;
let clothToDelete;
let userId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { dbName: "testCloth" });
  userId = new mongoose.Types.ObjectId();
  clothToDelete = await Cloth.create({
    user_id: userId,
    name: "name",
    color: "color",
    type: "type",
    tags: [],
    img_url: "img_url",
    public_id: "public_id",
    description: "description",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("DELETE /clothes/:cloth_id", async () => {
  const res = await request(app)
    .delete("/wardrobe/" + clothToDelete._id)
    .send();

  expect(res.status).toBe(200);

  expect(mockDeleteImageFromCloudinary).toHaveBeenCalled();

  const docs = await Cloth.find({ user_id: userId }).lean();
  expect(docs).toHaveLength(0);
});
