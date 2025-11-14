import request from "supertest";
import app from "../../../src/app";
import { AuthService } from "../../../src/services/auth.service";
import { createTestUser } from "../../helpers/test.helpers";

describe("User Routes Integration Tests", () => {
  let authService: AuthService;
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    authService = new AuthService();
    const user = await createTestUser("pedro.test@example.com", "password123");
    userId = user.id;

    const loginResult = await authService.login({
      email: "pedro.test@example.com",
      password: "password123",
    });
    authToken = loginResult.token;
  });

  describe("GET /profile", () => {
    it("should return user profile with valid token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("email");
      expect(response.body).toHaveProperty("profile");
      expect(response.body.id).toBe(userId);
    });

    it("should return 401 without token", async () => {
      const response = await request(app).get("/profile").expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Access token required");
    });

    it("should return 403 with invalid token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", "Bearer invalid-token")
        .expect(403);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid or expired token");
    });

    it("should return 401 with malformed Authorization header", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", "InvalidFormat")
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });
  });
});
