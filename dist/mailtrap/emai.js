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
exports.sendPasswordResetEmail = exports.sendResetSuccessEmail = exports.sendWelcomeEmail = exports.sendVerificationEmail = void 0;
const emailTemplate_1 = require("./emailTemplate");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendVerificationEmail = (email, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const recipient = [{ email }];
    const auth = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: "sameersheikhmansoori@gmail.com",
            pass: "alwsgrjdxpwaajkb",
        },
    });
    const receiver = {
        from: "sameersheikhmansoori@gmail.com",
        to: email,
        subject: `verification email for ${email}`,
        category: "verfication email",
        html: emailTemplate_1.VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };
    auth.sendMail(receiver, (err) => {
        console.log(err);
    });
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendWelcomeEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const recipient = [{ email }];
    const auth = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: "sameersheikhmansoori@gmail.com",
            pass: "alwsgrjdxpwaajkb",
        },
    });
    const receiver = {
        from: "sameersheikhmansoori@gmail.com",
        to: email,
        subject: "Welcome email",
        category: "Welcome email from apni company",
        template_uuid: process.env.TEMPLATE_UUID,
        template_variables: {
            name: name,
            company_info_name: "Apni company",
            company_info_address: "sumdi",
            company_info_city: "LA",
            company_info_zip_code: "0000",
            company_info_country: "wakanda",
        },
        //  html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };
    auth.sendMail(receiver, (err) => {
        console.log(err);
    });
});
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendResetSuccessEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: "sameersheikhmansoori@gmail.com",
            pass: "alwsgrjdxpwaajkb",
        },
    });
    const receiver = {
        from: "sameersheikhmansoori@gmail.com",
        to: email,
        subject: "reset password success",
        category: "Welcome email from apni company",
        html: emailTemplate_1.PASSWORD_RESET_SUCCESS_TEMPLATE,
    };
    auth.sendMail(receiver, (err) => {
        console.log(err);
    });
});
exports.sendResetSuccessEmail = sendResetSuccessEmail;
const sendPasswordResetEmail = (email, resetURL) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: "sameersheikhmansoori@gmail.com",
            pass: "alwsgrjdxpwaajkb",
        },
    });
    const receiver = {
        from: "sameersheikhmansoori@gmail.com",
        to: email,
        subject: "password reset email",
        category: "Welcome email from apni company",
        html: emailTemplate_1.PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    };
    auth.sendMail(receiver, (err) => {
        console.log(err);
    });
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
