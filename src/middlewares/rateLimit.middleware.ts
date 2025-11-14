import { Request, Response, NextFunction } from "express";

interface LoginAttempt {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 30 * 60 * 1000;

export const rateLimitLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const email = req.body?.email?.toLowerCase();
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  const key = email || ip;
  const now = Date.now();

  const attempt = loginAttempts.get(key);

  if (attempt) {
    if (attempt.count >= MAX_ATTEMPTS && now < attempt.resetTime + LOCKOUT_MS) {
      const remainingTime = Math.ceil(
        (attempt.resetTime + LOCKOUT_MS - now) / 1000 / 60
      );
      res.status(429).json({
        error: "Too many login attempts. Please try again later.",
        retryAfter: `${remainingTime} minutes`,
      });
      return;
    }

    if (now > attempt.resetTime) {
      loginAttempts.set(key, { count: 1, resetTime: now + WINDOW_MS });
      next();
      return;
    }

    attempt.count++;
  } else {
    loginAttempts.set(key, { count: 1, resetTime: now + WINDOW_MS });
  }

  if (Math.random() < 0.01) {
    for (const [k, v] of loginAttempts.entries()) {
      if (now > v.resetTime + LOCKOUT_MS) {
        loginAttempts.delete(k);
      }
    }
  }

  next();
};

export const resetLoginAttempts = (email: string): void => {
  loginAttempts.delete(email.toLowerCase());
};
