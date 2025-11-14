import {
  validateRegister,
  validateLogin,
} from "../../../src/middlewares/validation.middleware";
import { mockRequest, mockResponse } from "../../helpers/test.helpers";
import {
  mockRegisterRequest,
  mockLoginRequest,
} from "../../fixtures/user.fixtures";

describe("Validation Middleware", () => {
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();
  });

  describe("validateRegister", () => {
    it("should pass validation for valid register request", () => {
      const req = mockRequest(mockRegisterRequest);
      const res = mockResponse() as any;

      validateRegister(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject invalid email format", () => {
      const req = mockRequest({
        ...mockRegisterRequest,
        email: "invalid-email",
      });
      const res = mockResponse() as any;

      validateRegister(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Valid email is required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject missing email", () => {
      const req = mockRequest({ ...mockRegisterRequest, email: undefined });
      const res = mockResponse() as any;

      validateRegister(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject password shorter than 6 characters", () => {
      const req = mockRequest({ ...mockRegisterRequest, password: "12345" });
      const res = mockResponse() as any;

      validateRegister(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Password must be at least 6 characters long",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject missing password", () => {
      const req = mockRequest({ ...mockRegisterRequest, password: undefined });
      const res = mockResponse() as any;

      validateRegister(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject missing profile name", () => {
      const req = mockRequest({
        ...mockRegisterRequest,
        profile: { ...mockRegisterRequest.profile, name: undefined },
      });
      const res = mockResponse() as any;

      validateRegister(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Name is required" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject missing profile", () => {
      const req = mockRequest({ ...mockRegisterRequest, profile: undefined });
      const res = mockResponse() as any;

      validateRegister(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateLogin", () => {
    it("should pass validation for valid login request", () => {
      const req = mockRequest(mockLoginRequest);
      const res = mockResponse() as any;

      validateLogin(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject invalid email format", () => {
      const req = mockRequest({ ...mockLoginRequest, email: "invalid-email" });
      const res = mockResponse() as any;

      validateLogin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Valid email is required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject missing email", () => {
      const req = mockRequest({ ...mockLoginRequest, email: undefined });
      const res = mockResponse() as any;

      validateLogin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject missing password", () => {
      const req = mockRequest({ ...mockLoginRequest, password: undefined });
      const res = mockResponse() as any;

      validateLogin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Password is required" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
