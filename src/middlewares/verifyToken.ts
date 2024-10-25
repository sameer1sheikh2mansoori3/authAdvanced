import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { string } from 'zod';
import { Customreq } from '../Interfaces';


export const verifyToken = (req:any, res:Response, next:NextFunction):any => {
	const token = req.cookies.token;
	if (!token) res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	
	try {
        
		const decoded  = jwt.verify(token, process.env.JWT_SECRET || "") as any

		if (!decoded){  res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

	}

		req.userId = decoded?.userId;
		
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		 res.status(500).json({ success: false, message: "Server error" });
		 
	}
};