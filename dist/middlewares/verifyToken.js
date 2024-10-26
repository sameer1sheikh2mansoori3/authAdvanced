"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        console.log(token);
        if (!token)
            res
                .status(401)
                .json({ success: false, message: "Unauthorized - no token provided" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        if (!decoded) {
            res
                .status(401)
                .json({ success: false, message: "Unauthorized - invalid token" });
            return;
        }
        req.userId = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
        next();
    }
    catch (error) {
        console.log("Error in verifyToken ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.verifyToken = verifyToken;
