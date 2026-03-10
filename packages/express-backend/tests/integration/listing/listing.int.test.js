import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const { app } = await import("../../../src/app.js");
const { Listing } = await import("../../../src/models/listing.model.js");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: "testListing" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await Listing.deleteMany({});
});

const validListing = {
  user_id: new mongoose.Types.ObjectId(),
  title: "Nike Air Max 90",
  price: 120,
  marketplace: "eBay",
  url: "https://ebay.com/item/123",
  brand: "Nike",
  category: "Shoes",
  size: "10",
  gender: "Men",
  color: "White",
  description: "Good condition, worn twice",
};

test("POST /listings creates a listing", async () => {
  const res = await request(app).post("/listings").send(validListing);

  expect(res.status).toBe(201);
  expect(res.body.title).toBe(validListing.title);

  const docs = await Listing.find({ title: validListing.title });
  expect(docs).toHaveLength(1);
});

test("GET /listings returns listings sorted newest first", async () => {
  const userId = new mongoose.Types.ObjectId();

  const first = await Listing.create({
    ...validListing,
    user_id: userId,
    title: "Older Listing",
  });

  const second = await Listing.create({
    ...validListing,
    user_id: userId,
    title: "Newer Listing",
  });

  const res = await request(app).get("/listings");

  expect(res.status).toBe(200);
  expect(res.body[0]._id).toBe(String(second._id));
  expect(res.body[1]._id).toBe(String(first._id));
});
