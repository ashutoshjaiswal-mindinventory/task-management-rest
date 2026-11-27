const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

describe("Application endpoints", () => {
  describe("GET /health", () => {
    it("should return 200 and confirm API is running", async () => {
      const response = await request(app).get("/health");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Application is healthy",
        timestamp: expect.any(String),
      });
    });
  });

  describe("GET /", () => {
    it("should return the welcome message", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Welcome to Production REST API");
    });
  });
});

describe("Authentication validation", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should reject an invalid email address", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        name: "Test User",
        email: "invalid-email",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "email",
          }),
        ]),
      );
    });

    it("should reject a password shorter than 8 characters", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should reject an invalid email address", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "invalid-email",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject an empty password", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});
