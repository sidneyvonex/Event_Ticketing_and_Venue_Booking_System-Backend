
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
export const authMiddleware = (requiredRole: 'admin' | 'user' | 'both') =>
    (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.header('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
         res.status(401).json({ error: "Authorization header is missing or malformed" });
         return;
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token, process.env.JWT_SECRET!);
      if (!decoded) {
         res.status(401).json({ error: "Invalid token - Access denied." });
         return;
      }
  
      const role = decoded.userRole;
      const isAllowed =
        requiredRole === 'both' ? (role === 'admin' || role === 'user')
        : requiredRole === 'admin' ? role === 'admin'
        : requiredRole === 'user' ? role === 'user'
        : false;
  
      if (!isAllowed) {
        res.status(403).json({ error: "Access denied: You do not have the required permissions." });
        return;
      }
  
      req.user = decoded;
      next();
    };
  


//Middleware to check if the User is an Admin || Member || Both
export const adminRoleAuth  = authMiddleware('admin');
export const memberRoleAuth = authMiddleware('user');
export const bothRoleAuth   = authMiddleware('both');

