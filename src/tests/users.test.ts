import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import User from "../models/user.js";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Users API", () => {
  test("Register a new user", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "testuser",
      fullName: "Test User"
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe("testuser");
    expect(response.body.data.password).not.toBeDefined();
  });

  test("Fail to register duplicate user", async () => {
    await request(app).post("/auth/register").send({
      username: "testuser",
      fullName: "Test User"
    });

    const response = await request(app).post("/auth/register").send({
      username: "testuser",
      fullName: "Another User"
    });
    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test("Fail to register user without required fields", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "missingFullName"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
