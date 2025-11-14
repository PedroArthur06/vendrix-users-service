import { UserController } from "../../../src/controllers/user.controller";
import { UserService } from "../../../src/services/user.service";
import { mockRequest, mockResponse } from "../../helpers/test.helpers";
import { AuthRequest } from "../../../src/middlewares/auth.middleware";

jest.mock("../../../src/services/user.service");

describe("UserController", () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    userController = new UserController();
    (userController as any).userService = mockUserService;
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return user profile successfully", async () => {
      const mockUser = {
        id: "123",
        email: "pedro.test@example.com",
        profile: { name: "Pedro Arthur", lastName: "Rodrigues" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.getProfileById = jest
        .fn()
        .mockResolvedValue(mockUser as any);

      const req = mockRequest({}, {}) as AuthRequest;
      req.user = { id: "123", email: "pedro.test@example.com" };
      const res = mockResponse() as any;

      await userController.getProfile(req, res);

      expect(mockUserService.getProfileById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        profile: mockUser.profile,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = mockRequest({}, {}) as AuthRequest;
      req.user = undefined;
      const res = mockResponse() as any;

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    });

    it("should return 404 if user not found", async () => {
      mockUserService.getProfileById = jest.fn().mockResolvedValue(null);

      const req = mockRequest({}, {}) as AuthRequest;
      req.user = { id: "123", email: "pedro.test@example.com" };
      const res = mockResponse() as any;

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 for unexpected errors", async () => {
      mockUserService.getProfileById = jest
        .fn()
        .mockRejectedValue("Unexpected error");

      const req = mockRequest({}, {}) as AuthRequest;
      req.user = { id: "123", email: "pedro.test@example.com" };
      const res = mockResponse() as any;

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
