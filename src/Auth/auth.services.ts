import { eq } from "drizzle-orm";
import db from "../drizzle/db"
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema"
import bcrypt from "bcrypt";

//Create a new user
export const createUserService = async(user:TUserInsert):Promise<string> =>{
    await db.insert(userTable).values(user).returning();
    return "User created successfully";
}

//Get User by email
export const getUserByEmailService = async(email:string):Promise<TUserSelect | undefined> =>{
    return await db.query.userTable.findFirst({
        where:(eq(userTable.email,email))
    })
}

//Get User by ID
export const getUserByIdService = async(userId:number):Promise<TUserSelect | undefined> =>{
    return await db.query.userTable.findFirst({
        where:(eq(userTable.userId,userId))
    })
}

//Update user email verification status
export const updateEmailVerificationService = async(userId: number, emailVerified: number):Promise<string> => {
    await db.update(userTable).set({ emailVerified }).where(eq(userTable.userId, userId));
    return "Email verification status updated successfully";
}

//Store password reset token
export const storePasswordResetTokenService = async(email: string, resetToken: string, resetTokenExpiry: Date):Promise<string> => {
    await db.update(userTable).set({ 
        resetToken, 
        resetTokenExpiry 
    }).where(eq(userTable.email, email));
    return "Password reset token stored successfully";
}

//Get user by reset token
export const getUserByResetTokenService = async(resetToken: string):Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where:(eq(userTable.resetToken, resetToken))
    })
}

//Update user password
export const updateUserPasswordService = async(userId: number, newPassword: string):Promise<string> => {
    await db.update(userTable).set({ 
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null 
    }).where(eq(userTable.userId, userId));
    return "Password updated successfully";
}

//Store email verification token
export const storeEmailVerificationTokenService = async(userId: number, verificationToken: string, verificationTokenExpiry: Date):Promise<string> => {
    await db.update(userTable).set({ 
        verificationToken, 
        verificationTokenExpiry 
    }).where(eq(userTable.userId, userId));
    return "Email verification token stored successfully";
}

//Get user by verification token
export const getUserByVerificationTokenService = async(verificationToken: string):Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where:(eq(userTable.verificationToken, verificationToken))
    })
}

//Generate secure random token using bcrypt
export const generateSecureToken = ():string => {
    // Generate a random string and hash it with bcrypt to create a secure token
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString();
    const combinedString = randomString + timestamp;
    
    // Use bcrypt to generate a hash-based token
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(combinedString, salt).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
}