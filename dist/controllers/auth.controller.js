"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.resetPassword = exports.verifyEmail = exports.forgotPassword = exports.logout = exports.login = exports.registerController = void 0;
const Interfaces_1 = require("../Interfaces");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = require("../models/User.model");
const crypto_1 = __importDefault(require("crypto"));
const generateTokenAndSetCookie_1 = require("../utils/generateTokenAndSetCookie");
const emai_1 = require("../mailtrap/emai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "./.env"
});
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedUser = Interfaces_1.registerUser.safeParse(req.body);
    console.log(parsedUser);
    if (!parsedUser.success) {
        res.status(400).json({
            "message": parsedUser.error,
            "data": parsedUser.data
        });
        return;
    }
    try {
        const userExists = yield User_model_1.User.findOne({
            email: parsedUser.data.email
        });
        if (userExists) {
            res.status(409).json({
                message: "user with this email already exists",
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const createUser = yield User_model_1.User.create({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(res, createUser._id);
        console.log(createUser);
        yield (0, emai_1.sendVerificationEmail)(createUser.email, verificationToken);
        res.status(200).json({
            message: "user created successfully",
            data: createUser,
        });
        return;
    }
    catch (error) {
        console.log(`error while registering user`, error);
        throw new Error("error while registering user");
    }
});
exports.registerController = registerController;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(res, user._id);
        user.lastLogin = new Date();
        yield user.save();
        yield (0, emai_1.sendWelcomeEmail)(user.email, user.name);
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: Object.assign(Object.assign({}, user), { password: undefined }),
        });
    }
    catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_model_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        yield user.save();
        // send email
        yield (0, emai_1.sendPasswordResetEmail)(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    }
    catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.forgotPassword = forgotPassword;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    try {
        const user = yield User_model_1.User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        yield user.save();
        yield (0, emai_1.sendWelcomeEmail)(user.email, user.name);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                password: undefined,
            },
        });
    }
    catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.verifyEmail = verifyEmail;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = yield User_model_1.User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        // update password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        yield user.save();
        yield (0, emai_1.sendResetSuccessEmail)(user.email);
        res.status(200).json({ success: true, message: "Password reset successful" });
    }
    catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.resetPassword = resetPassword;
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.userId, "added userId");
        const user = yield User_model_1.User.findById(req.userId).select("-password");
        console.log(user, "added user is here");
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return; // Ensures the function has a `void` return type in this branch
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.checkAuth = checkAuth;
