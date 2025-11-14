import { Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await this.userService.getProfileById(req.user.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
