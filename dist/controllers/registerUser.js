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
exports.registerController = void 0;
const Interfaces_1 = require("../Interfaces");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = require("../models/User.model");
const generateTokenAndSetCookie_1 = require("../utils/generateTokenAndSetCookie");
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
