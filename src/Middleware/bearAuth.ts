
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config(); // Load environment variables from .env file

declare global{
    namespace Express{
        interface Request{
            user?: DecodedToken; // Attach the decoded token to the request object
        }
    }
}
type DecodedToken ={
    userId: number;
    email: string;
    fullName: string;
    userRole: string;
    exp: number; // Expiration time in seconds
}

//Authentication middleware to protect routes
export const verifyToken =(token:string,secret:string) => {
    try{
        //decodes the token using the secret and get the payload
        const decoded = jwt.verify(token, secret) as DecodedToken; // Cast the decoded token to the DecodedToken type
        return decoded; // Return the decoded payload if verification is successful

    }catch (error) {
        return null; // Return null if verification fails
    }

}

//Authorization middleware
export const authMiddleware = async(req:Request,res:Response,next:NextFunction,requiredRole:string) =>{
    const token = req.header('Authorization'); // Get the Authorization header from the request
    if(!token){
        res.status(401).json({ error: " Authorization header is missing" });
        return; // Prevent further execution
    }

    const decodedToken = verifyToken(token,process.env.JWT_SECRET as string); // Verify the token using the secret

    if(!decodedToken){
        res.status(401).json({ error: "Invalid token - Access denied." });
        return; // Prevent further execution
    }
    const userType = decodedToken?.userRole; // Get the user role from the decoded token

    if(requiredRole === "both" && (userType === "admin" || userType === "user")) {
        // If the required role is both and the user is either an admin or a member
        if(decodedToken?.userRole === "admin" || decodedToken?.userRole === "user"){
            req.user = decodedToken; // Attach the decoded token to the request object
            next(); // Call the next middleware or route handler
            return; // Prevent further execution
        }
    } else if(requiredRole === "admin" && userType === "admin") {
        // If the required role is admin and the user is an admin
        req.user = decodedToken; // Attach the decoded token to the request object
        next(); // Call the next middleware or route handler
        return; // Prevent further execution
    }else{
        res.status(403).json({ error: "Access denied :  You do not have the required permissions." });
        return; // Prevent further execution
    }

}


//Middleware to check if the User is an Admin
export const adminRoleAuth = async(req:Request,res:Response,next:NextFunction) =>{await authMiddleware(req,res,next,"admin")} 


//Middleware to check if the User is an member/Normal User
export const memberRoleAuth = async(req:Request,res:Response,next:NextFunction) =>{await authMiddleware(req,res,next,"user")} 


//Middleware to check if the User is either an Admin or a Member
export const bothRoleAuth = async(req:Request,res:Response,next:NextFunction) =>{await authMiddleware(req,res,next,"both")} 
