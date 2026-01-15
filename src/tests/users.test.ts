import dotenv from "dotenv";
dotenv.config();

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
    const response = await request(app).post("/users/register").send({
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      password: "password123"
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.username).toBe("testuser");
    expect(response.body.data.user.email).toBe("test@example.com");
    expect(response.body.data.user.password).not.toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    expect(typeof response.body.data.accessToken).toBe("string");
    expect(typeof response.body.data.refreshToken).toBe("string");
  });

  test("Fail to register duplicate username", async () => {
    await request(app).post("/users/register").send({
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      password: "password123"
    });

    const response = await request(app).post("/users/register").send({
      username: "testuser",
      email: "different@example.com",
      fullName: "Another User",
      password: "password456"
    });
    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Username already exists");
  });

  test("Fail to register duplicate email", async () => {
    await request(app).post("/users/register").send({
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      password: "password123"
    });

    const response = await request(app).post("/users/register").send({
      username: "differentuser",
      email: "test@example.com",
      fullName: "Another User",
      password: "password456"
    });
    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Email already exists");
  });

  test("Fail to register user without required fields", async () => {
    const response = await request(app).post("/users/register").send({
      username: "missingFields"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Fail to register user with invalid email", async () => {
    const response = await request(app).post("/users/register").send({
      username: "testuser",
      email: "invalid-email",
      fullName: "Test User",
      password: "password123"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Invalid email format");
  });

  test("Login with valid credentials", async () => {
    await request(app).post("/users/register").send({
      username: "loginuser",
      email: "login@example.com",
      fullName: "Login User",
      password: "password123"
    });

    const response = await request(app).post("/users/login").send({
      username: "loginuser",
      password: "password123"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.username).toBe("loginuser");
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  test("Fail to login with invalid password", async () => {
    await request(app).post("/users/register").send({
      username: "loginuser",
      email: "login@example.com",
      fullName: "Login User",
      password: "password123"
    });

    const response = await request(app).post("/users/login").send({
      username: "loginuser",
      password: "wrongpassword"
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Invalid username or password");
  });

  test("Refresh token successfully", async () => {
    const registerResponse = await request(app).post("/users/register").send({
      username: "refreshuser",
      email: "refresh@example.com",
      fullName: "Refresh User",
      password: "password123"
    });

    const refreshToken = registerResponse.body.data.refreshToken;

    const response = await request(app).post("/users/refresh").send({
      refreshToken
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });
});
