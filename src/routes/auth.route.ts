import { Router } from "express";
import { registerUser } from "../Interfaces";
import { checkAuth, forgotPassword, login, logout, registerController, resetPassword, verifyEmail } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.route("/signup").post(registerController);
router.route('/login').post(login)


router.get("/check-auth", verifyToken, checkAuth);


router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.get("/reset-password/:token", resetPassword);
export default router;