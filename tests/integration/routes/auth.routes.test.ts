import request from "supertest";
import app from "../../../src/app";
import { UserModel } from "../../../src/models/user.model";
import { createTestUser } from "../../helpers/test.helpers";
import {
  mockRegisterRequest,
  mockLoginRequest,
} from "../../fixtures/user.fixtures";

describe("Auth Routes Integration Tests", () => {
  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/register")
        .send(mockRegisterRequest)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(
        mockRegisterRequest.email.toLowerCase()
      );
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/register")
        .send({ ...mockRegisterRequest, email: "invalid-email" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 for short password", async () => {
      const response = await request(app)
        .post("/register")
        .send({ ...mockRegisterRequest, password: "12345" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 409 for duplicate email", async () => {
      await request(app)
        .post("/register")
        .send(mockRegisterRequest)
        .expect(201);

      const response = await request(app)
        .post("/register")
        .send(mockRegisterRequest)
        .expect(409);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("User with this email already exists");
    });
  });

  describe("POST /login", () => {
    beforeEach(async () => {
      await createTestUser(mockLoginRequest.email, mockLoginRequest.password);
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/login")
        .send(mockLoginRequest)
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(
        mockLoginRequest.email.toLowerCase()
      );
    });

    it("should return 401 for invalid email", async () => {
      const response = await request(app)
        .post("/login")
        .send({ ...mockLoginRequest, email: "wrong@example.com" })
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid email or password");
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app)
        .post("/login")
        .send({ ...mockLoginRequest, password: "wrongpassword" })
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid email or password");
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/login")
        .send({ ...mockLoginRequest, email: "invalid-email" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
