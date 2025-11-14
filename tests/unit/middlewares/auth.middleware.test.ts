import {
  authenticateToken,
  AuthRequest,
} from "../../../src/middlewares/auth.middleware";
import { AuthService } from "../../../src/services/auth.service";
import { mockRequest, mockResponse } from "../../helpers/test.helpers";

jest.mock("../../../src/services/auth.service");

describe("authenticateToken middleware", () => {
  let mockVerifyToken: jest.Mock;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();
    mockVerifyToken = jest.fn();

    (AuthService as jest.MockedClass<typeof AuthService>).mockImplementation(
      () => {
        return {
          verifyToken: mockVerifyToken,
        } as any;
      }
    );

    jest.clearAllMocks();
  });

  it("should authenticate valid token and attach user to request", () => {
    const token = "valid-token";
    const decoded = { id: "123", email: "pedro.test@example.com" };

    mockVerifyToken.mockReturnValue(decoded);

    const req = mockRequest(
      {},
      { authorization: `Bearer ${token}` }
    ) as AuthRequest;
    const res = mockResponse() as any;

    authenticateToken(req, res, mockNext);

    expect(mockVerifyToken).toHaveBeenCalledWith(token);
    expect(req.user).toEqual(decoded);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if no token provided", () => {
    const req = mockRequest({}, {}) as AuthRequest;
    const res = mockResponse() as any;

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Access token required" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if Authorization header is missing", () => {
    const req = mockRequest({}, {}) as AuthRequest;
    const res = mockResponse() as any;

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 for invalid token", () => {
    const token = "invalid-token";
    mockVerifyToken.mockImplementation(() => {
      throw new Error("Invalid or expired token");
    });

    const req = mockRequest(
      {},
      { authorization: `Bearer ${token}` }
    ) as AuthRequest;
    const res = mockResponse() as any;

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should extract token from Bearer format", () => {
    const token = "valid-token";
    const decoded = { id: "123", email: "test@example.com" };

    mockVerifyToken.mockReturnValue(decoded);

    const req = mockRequest(
      {},
      { authorization: `Bearer ${token}` }
    ) as AuthRequest;
    const res = mockResponse() as any;

    authenticateToken(req, res, mockNext);

    expect(mockVerifyToken).toHaveBeenCalledWith(token);
  });
});
