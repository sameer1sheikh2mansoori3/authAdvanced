
import jwt from "jsonwebtoken";
import { Customreq } from "../Interfaces";

export const generateTokenAndSetCookie = (res:any, userId:any) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET || "", {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};