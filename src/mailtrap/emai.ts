import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate";
import nodemailer from "nodemailer";
export const sendVerificationEmail = async (
  email: any,
  verificationToken: any
) => {
  const recipient = [{ email }];

  const auth = nodemailer.createTransport({
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
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  auth.sendMail(receiver, (err: any) => {
    console.log(err);
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const recipient = [{ email }];

  const auth = nodemailer.createTransport({
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

  auth.sendMail(receiver, (err: any) => {
    console.log(err);
  });
};

export const sendResetSuccessEmail = async (email: string) => {
  const auth = nodemailer.createTransport({
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

    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  auth.sendMail(receiver, (err: any) => {
    console.log(err);
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
) => {
  const auth = nodemailer.createTransport({
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

    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };
  auth.sendMail(receiver, (err: any) => {
    console.log(err);
  });
};
