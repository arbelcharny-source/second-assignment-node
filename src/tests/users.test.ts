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
      email: "test@example.com",
      fullName: "Test User"
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe("testuser");
    expect(response.body.data.email).toBe("test@example.com");
    expect(response.body.data.password).not.toBeDefined();
  });

  test("Fail to register duplicate username", async () => {
    await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User"
    });

    const response = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "different@example.com",
      fullName: "Another User"
    });
    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Username already exists");
  });

  test("Fail to register duplicate email", async () => {
    await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User"
    });

    const response = await request(app).post("/auth/register").send({
      username: "differentuser",
      email: "test@example.com",
      fullName: "Another User"
    });
    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Email already exists");
  });

  test("Fail to register user without required fields", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "missingFields"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Fail to register user with invalid email", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "invalid-email",
      fullName: "Test User"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Invalid email format");
  });
});
