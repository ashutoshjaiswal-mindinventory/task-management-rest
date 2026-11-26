"use strict";

const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app");
const { User, sequelize } = require("../models");

describe("Authentication APIs", () => {
  beforeEach(async () => {
    await User.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);

      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          role: "user",
        }),
      );

      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should not register a user with an existing email", async () => {
      await User.create({
        name: "Existing User",
        email: "test@example.com",
        password: await bcrypt.hash("Password@123", 12),
      });

      const response = await request(app).post("/api/v1/auth/register").send({
        name: "Another User",
        email: "test@example.com",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email is already registered");
    });

    it("should store the password as a hash", async () => {
      await request(app).post("/api/v1/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password@123",
      });

      const user = await User.findOne({
        where: { email: "test@example.com" },
      });

      expect(user.password).not.toBe("Password@123");

      const isPasswordValid = await bcrypt.compare(
        "Password@123",
        user.password,
      );

      expect(isPasswordValid).toBe(true);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash("Password@123", 12),
      });
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");

      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          role: "user",
        }),
      );

      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should reject login with an incorrect password", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "WrongPassword@123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should reject login with an unregistered email", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "unknown@example.com",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash("Password@123", 12),
      });
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");

      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          role: "user",
        }),
      );

      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should reject login with an incorrect password", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "WrongPassword@123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should reject login with an unregistered email", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "unknown@example.com",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });
});
