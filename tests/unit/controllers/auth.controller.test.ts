import { AuthController } from "../../../src/controllers/auth.controller";
import { AuthService } from "../../../src/services/auth.service";
import {
  mockRegisterRequest,
  mockLoginRequest,
} from "../../fixtures/user.fixtures";
import { mockRequest, mockResponse } from "../../helpers/test.helpers";
import { resetLoginAttempts } from "../../../src/middlewares/rateLimit.middleware";

jest.mock("../../../src/services/auth.service");
jest.mock("../../../src/middlewares/rateLimit.middleware");

describe("AuthController", () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController();
    (authController as any).authService = mockAuthService;
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register user successfully", async () => {
      const mockResult = {
        token: "mock-token",
        user: {
          id: "123",
          email: mockRegisterRequest.email,
          profile: mockRegisterRequest.profile,
        },
      };

      mockAuthService.register = jest.fn().mockResolvedValue(mockResult);

      const req = mockRequest(mockRegisterRequest);
      const res = mockResponse() as any;

      await authController.register(req, res);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        mockRegisterRequest
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 409 for duplicate email", async () => {
      const error = new Error("User with this email already exists");
      mockAuthService.register = jest.fn().mockRejectedValue(error);

      const req = mockRequest(mockRegisterRequest);
      const res = mockResponse() as any;

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it("should return 400 for validation errors", async () => {
      const error = new Error("Validation error");
      mockAuthService.register = jest.fn().mockRejectedValue(error);

      const req = mockRequest(mockRegisterRequest);
      const res = mockResponse() as any;

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it("should return 500 for unexpected errors", async () => {
      mockAuthService.register = jest
        .fn()
        .mockRejectedValue("Unexpected error");

      const req = mockRequest(mockRegisterRequest);
      const res = mockResponse() as any;

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const mockResult = {
        token: "mock-token",
        user: {
          id: "123",
          email: mockLoginRequest.email,
          profile: { name: "John" },
        },
      };

      mockAuthService.login = jest.fn().mockResolvedValue(mockResult);
      (resetLoginAttempts as jest.Mock) = jest.fn();

      const req = mockRequest(mockLoginRequest);
      const res = mockResponse() as any;

      await authController.login(req, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginRequest);
      expect(resetLoginAttempts).toHaveBeenCalledWith(mockLoginRequest.email);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 401 for invalid credentials", async () => {
      const error = new Error("Invalid email or password");
      mockAuthService.login = jest.fn().mockRejectedValue(error);

      const req = mockRequest(mockLoginRequest);
      const res = mockResponse() as any;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it("should return 500 for unexpected errors", async () => {
      mockAuthService.login = jest.fn().mockRejectedValue("Unexpected error");

      const req = mockRequest(mockLoginRequest);
      const res = mockResponse() as any;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
