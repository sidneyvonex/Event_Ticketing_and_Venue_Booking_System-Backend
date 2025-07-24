
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
        // Check if secret exists
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment variables');
            return null;
        }

        //decodes the token using the secret and get the payload
        const decoded = jwt.verify(token, secret) as DecodedToken; // Cast the decoded token to the DecodedToken type
        
        // Validate token structure
        if (!decoded.userId || !decoded.email || !decoded.userRole) {
            console.error('Invalid token structure - missing required fields');
            return null;
        }

        return decoded; // Return the decoded payload if verification is successful

    }catch (error: any) {
        // Log specific JWT errors for debugging
        if (error.name === 'TokenExpiredError') {
            console.error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Invalid token format');
        } else if (error.name === 'NotBeforeError') {
            console.error('Token not active yet');
        } else {
            console.error('Token verification failed:', error.message);
        }
        return null; // Return null if verification fails
    }

}

//Authorization middleware
export const authMiddleware = (requiredRole: 'admin' | 'user' | 'both') =>
    (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.header('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
         res.status(401).json({ error: "Authorization header is missing or malformed" });
         return;
      }
  
      const token = authHeader.split(' ')[1];
      
      // Check if token exists after splitting
      if (!token) {
        res.status(401).json({ error: "Token is missing from Authorization header" });
        return;
      }

      // Check if JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET environment variable is not set');
        res.status(500).json({ error: "Server configuration error" });
        return;
      }

      const decoded = verifyToken(token, process.env.JWT_SECRET);
      if (!decoded) {
         res.status(401).json({ error: "Invalid or expired token - Access denied." });
         return;
      }
  
      const role = decoded.userRole?.toLowerCase(); // Normalize role case
      const normalizedRequiredRole = requiredRole.toLowerCase();
      
      const isAllowed =
        normalizedRequiredRole === 'both' ? (role === 'admin' || role === 'user')
        : normalizedRequiredRole === 'admin' ? role === 'admin'
        : normalizedRequiredRole === 'user' ? role === 'user'
        : false;
  
      if (!isAllowed) {
        res.status(403).json({ 
          error: "Access denied: You do not have the required permissions.",
          required: requiredRole,
          current: decoded.userRole
        });
        return;
      }
  
      req.user = decoded;
      next();
    };
  


//Middleware to check if the User is an Admin || Member || Both
export const adminRoleAuth  = authMiddleware('admin');
export const memberRoleAuth = authMiddleware('user');
export const bothRoleAuth   = authMiddleware('both');

