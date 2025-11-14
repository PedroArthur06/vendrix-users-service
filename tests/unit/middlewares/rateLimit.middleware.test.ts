import {
  rateLimitLogin,
  resetLoginAttempts,
} from "../../../src/middlewares/rateLimit.middleware";
import { mockRequest, mockResponse } from "../../helpers/test.helpers";

describe("rateLimitLogin middleware", () => {
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();
    resetLoginAttempts("pedro.test@example.com");
  });

  it("should allow request for first attempt", () => {
    const req = mockRequest({ email: "pedro.test@example.com" });
    const res = mockResponse() as any;

    rateLimitLogin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should allow requests within limit", () => {
    const req = mockRequest({ email: "pedro.test@example.com" });
    const res = mockResponse() as any;

    for (let i = 0; i < 4; i++) {
      rateLimitLogin(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalledTimes(4);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should block request after max attempts", () => {
    const req = mockRequest({ email: "pedro.test@example.com" });
    const res = mockResponse() as any;

    for (let i = 0; i < 5; i++) {
      rateLimitLogin(req, res, mockNext);
    }

    rateLimitLogin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Too many login attempts. Please try again later.",
      })
    );
    expect(mockNext).toHaveBeenCalledTimes(5);
  });

  it("should track attempts by email", () => {
    const req1 = mockRequest({ email: "user1@example.com" });
    const req2 = mockRequest({ email: "user2@example.com" });
    const res = mockResponse() as any;

    for (let i = 0; i < 5; i++) {
      rateLimitLogin(req1, res, mockNext);
    }

    rateLimitLogin(req2, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(6);
  });

  it("should track attempts by IP when email is not provided", () => {
    const req = mockRequest({}, {});
    req.email = undefined;
    const res = mockResponse() as any;

    for (let i = 0; i < 5; i++) {
      rateLimitLogin(req, res, mockNext);
    }

    rateLimitLogin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(mockNext).toHaveBeenCalledTimes(5);
  });

  it("should reset attempts after successful login", () => {
    const req = mockRequest({ email: "pedro.test@example.com" });
    const res = mockResponse() as any;

    for (let i = 0; i < 3; i++) {
      rateLimitLogin(req, res, mockNext);
    }

    resetLoginAttempts("pedro.test@example.com");

    rateLimitLogin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(4);
    expect(res.status).not.toHaveBeenCalled();
  });
});
