import { UserService } from "../../../src/services/user.service";
import { createTestUser } from "../../helpers/test.helpers";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("getProfileById", () => {
    it("should return user profile by id", async () => {
      const user = await createTestUser();
      const profile = await userService.getProfileById(user.id);

      expect(profile).toBeTruthy();
      expect(profile?.id).toBe(user.id);
      expect(profile?.email).toBe(user.email);
    });

    it("should return null for non-existent user id", async () => {
      const profile = await userService.getProfileById(
        "507f1f77bcf86cd799439011"
      );

      expect(profile).toBeNull();
    });
  });

  describe("getProfileByEmail", () => {
    it("should return user profile by email", async () => {
      const email = "test@example.com";
      await createTestUser(email);
      const profile = await userService.getProfileByEmail(email);

      expect(profile).toBeTruthy();
      expect(profile?.email).toBe(email);
    });

    it("should be case-insensitive when searching by email", async () => {
      const email = "test@example.com";
      await createTestUser(email);
      const profile = await userService.getProfileByEmail("TEST@EXAMPLE.COM");

      expect(profile).toBeTruthy();
      expect(profile?.email).toBe(email);
    });

    it("should return null for non-existent email", async () => {
      const profile = await userService.getProfileByEmail(
        "nonexistent@example.com"
      );

      expect(profile).toBeNull();
    });
  });
});
