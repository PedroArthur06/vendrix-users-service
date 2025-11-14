import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middlewares/validation.middleware";
import { rateLimitLogin } from "../middlewares/rateLimit.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", validateRegister, authController.register.bind(authController));
router.post("/login", validateLogin, rateLimitLogin, authController.login.bind(authController));

export default router;

