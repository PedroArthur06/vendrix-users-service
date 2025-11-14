import { AuthService } from "../../../src/services/auth.service";
import { UserModel } from "../../../src/models/user.model";
import { createTestUser } from "../../helpers/test.helpers";
import {
  mockRegisterRequest,
  mockLoginRequest,
} from "../../fixtures/user.fixtures";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const result = await authService.register(mockRegisterRequest);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("user");
      expect(result.user.email).toBe(mockRegisterRequest.email.toLowerCase());
      expect(result.user.profile.name).toBe(mockRegisterRequest.profile.name);
    });

    it("should hash password before saving", async () => {
      await authService.register(mockRegisterRequest);

      const user = await UserModel.findOne({
        email: mockRegisterRequest.email.toLowerCase(),
      });
      expect(user).toBeTruthy();
      expect(user?.passwordHash).not.toBe(mockRegisterRequest.password);
      expect(
        await bcrypt.compare(mockRegisterRequest.password, user!.passwordHash)
      ).toBe(true);
    });

    it("should throw error if user already exists", async () => {
      await authService.register(mockRegisterRequest);

      await expect(authService.register(mockRegisterRequest)).rejects.toThrow(
        "User with this email already exists"
      );
    });

    it("should convert email to lowercase", async () => {
      const request = { ...mockRegisterRequest, email: "TEST@EXAMPLE.COM" };
      await authService.register(request);

      const user = await UserModel.findOne({ email: "test@example.com" });
      expect(user).toBeTruthy();
    });

    it("should generate a valid JWT token", async () => {
      const result = await authService.register(mockRegisterRequest);

      const decoded = authService.verifyToken(result.token);
      expect(decoded.email).toBe(mockRegisterRequest.email.toLowerCase());
      expect(decoded.id).toBeTruthy();
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await createTestUser(mockLoginRequest.email, mockLoginRequest.password);
    });

    it("should login successfully with valid credentials", async () => {
      const result = await authService.login(mockLoginRequest);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("user");
      expect(result.user.email).toBe(mockLoginRequest.email.toLowerCase());
    });

    it("should throw error for invalid email", async () => {
      const invalidRequest = {
        ...mockLoginRequest,
        email: "invalid@example.com",
      };

      await expect(authService.login(invalidRequest)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error for invalid password", async () => {
      const invalidRequest = { ...mockLoginRequest, password: "wrongpassword" };

      await expect(authService.login(invalidRequest)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should generate a valid JWT token on login", async () => {
      const result = await authService.login(mockLoginRequest);

      const decoded = authService.verifyToken(result.token);
      expect(decoded.email).toBe(mockLoginRequest.email.toLowerCase());
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token", async () => {
      const result = await authService.register(mockRegisterRequest);
      const decoded = authService.verifyToken(result.token);

      expect(decoded).toHaveProperty("id");
      expect(decoded).toHaveProperty("email");
      expect(decoded.email).toBe(mockRegisterRequest.email.toLowerCase());
    });

    it("should throw error for invalid token", () => {
      expect(() => authService.verifyToken("invalid-token")).toThrow(
        "Invalid or expired token"
      );
    });

    it("should throw error for expired token", () => {
      const expiredToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.invalid";

      expect(() => authService.verifyToken(expiredToken)).toThrow(
        "Invalid or expired token"
      );
    });
  });
});
