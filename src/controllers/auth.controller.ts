import { NextFunction, Request, Response } from "express";
import { Customreq, registerUser, registerUsertype } from "../Interfaces";
import bcryptjs from "bcryptjs";
import { User } from "../models/User.model";
import crypto from 'crypto'
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emai";
import dotenv from 'dotenv'
dotenv.config({
  path:"./.env"
})

interface CustomRequest extends Request {
  userId?: string; // Adjust based on your actual data type
}
export const registerController = async (req: Request, res: Response) => {
  const parsedUser = registerUser.safeParse(req.body);
  console.log(parsedUser)
  if (!parsedUser.success) {
    res.status(400).json({
      "message": parsedUser.error,
      "data":parsedUser.data

    });
    return;
  }

  try {
    const userExists = await User.findOne({
      email:parsedUser.data.email
    });
    if (userExists) {
      res.status(409).json({
        message: "user with this email already exists",
      });
      return;
    }
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const createUser = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    generateTokenAndSetCookie(res, createUser._id)
    console.log(createUser)
    await sendVerificationEmail(createUser.email , verificationToken)
    res.status(200).json({
      message: "user created successfully",
      data: createUser,
    });
    return;
  } catch (error) {
    console.log(`error while registering user`, error);
    throw new Error("error while registering user");
  }
};

export const login = async (req :Request, res :Response):Promise<any> => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();
    await sendWelcomeEmail(user.email , user.name)
		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user,
				password: undefined,
			},
		});
	} catch (error:any) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

 export const logout = async (req:Request, res:Response) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req:Request, res: Response) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			 res.status(400).json({ success: false, message: "User not found" });
       return
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error : any) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const verifyEmail = async (req:any, res:any) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

 export const resetPassword = async (req:any, res:any) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error:any) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
	console.log(req.userId , "added userId")
      const user = await User.findById(req.userId).select("-password");
console.log(user , "added user is here")
      if (!user) {
          res.status(400).json({ success: false, message: "User not found" });
          return; // Ensures the function has a `void` return type in this branch
      }

      res.status(200).json({ success: true, user });
	  
  } catch (error: any) {
      console.log("Error in checkAuth", error);
      res.status(400).json({ success: false, message: error.message });
  }
};



