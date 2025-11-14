import { Request, Response, NextFunction } from "express";
import { RegisterRequest, LoginRequest } from "../types/request.types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, profile } = req.body as RegisterRequest;

  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  if (!password || password.length < 6) {
    res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
    return;
  }

  if (!profile || !profile.name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body as LoginRequest;

  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  next();
};
