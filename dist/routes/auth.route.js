"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
router.route("/signup").post(auth_controller_1.registerController);
router.route('/login').post(auth_controller_1.login);
router.get("/check-auth", verifyToken_1.verifyToken, auth_controller_1.checkAuth);
router.post("/logout", auth_controller_1.logout);
router.post("/verify-email", auth_controller_1.verifyEmail);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.get("/reset-password/:token", auth_controller_1.resetPassword);
exports.default = router;