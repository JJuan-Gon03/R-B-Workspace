import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mockParseCloth = jest.fn();
const mockMain = jest.fn();

jest.unstable_mockModule("../../../src/services/gemini.service.js", () => ({
  parse_cloth: mockParseCloth,
  main: mockMain,
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

test("POST /clothes",async()=>{
  mockParseCloth.mockResolvedValueOnce("description")

  const reqBody={user_id:123,name:"name",color:"color",type:"type",tags:[],img_url:"img_url"}
  const resBody={user_id:123,name:"name",color:"color",type:"type",tags:[],img_url:"img_url",description:"description"}

  const res=await request(app).post("/wardrobe").send(reqBody)

  expect(res.status).toBe(201)
  expect(res.body).toMatchObject(resBody)

  const docs=await Cloth.find({user_id: 123}).lean()
  expect(docs).toHaveLength(1)
  expect(docs[0]).toMatchObject(resBody)
})
