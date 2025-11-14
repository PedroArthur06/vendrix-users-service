import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const authService = new AuthService();
    const decoded = authService.verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

