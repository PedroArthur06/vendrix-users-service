import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.get("/profile", authenticateToken, userController.getProfile.bind(userController));

export default router;

