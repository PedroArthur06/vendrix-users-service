import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterRequest, LoginRequest } from "../types/request.types";
import { resetLoginAttempts } from "../middlewares/rateLimit.middleware";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as RegisterRequest;
      const result = await this.authService.register(data);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User with this email already exists") {
          res.status(409).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as LoginRequest;
      const result = await this.authService.login(data);

      resetLoginAttempts(data.email);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Invalid email or password") {
          res.status(401).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
