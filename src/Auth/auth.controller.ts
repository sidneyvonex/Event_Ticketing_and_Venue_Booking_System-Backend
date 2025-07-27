import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { 
    createUserService, 
    getUserByEmailService, 
    getUserByIdService,
    updateEmailVerificationService,
    storePasswordResetTokenService,
    getUserByResetTokenService,
    updateUserPasswordService,
    storeEmailVerificationTokenService,
    getUserByVerificationTokenService,
    generateSecureToken
} from "./auth.services";
import { loginValidator, userValidator } from "../Validation/user.validator";
import { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendAccountVerificationEmail, sendEmailVerificationSuccessEmail } from "../emails";

export const createUser = async (req: Request, res: Response) => {

    try {
        const parseResult = userValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const { firstName,lastName,email,password,contactPhone,address,userRole } = req.body; //destructuring the request body
        if (!firstName||!lastName ||!email||!password||!contactPhone||!address) {
            res.status(400).json({ error: "All fields are required" });
            return; // Prevent further execution
    }

        const existingUser = await getUserByEmailService(email);
        if (existingUser) {
        res.status(409).json({ error: "Email already exists" });
        return;
}

    //generate hashed password
    
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt with 12 rounds
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password with the generated salt

    // console.log("🌟 ~ createUser ~ hashedPassword:", hashedPassword)

    const newUser = await createUserService({firstName,lastName,email,password:hashedPassword,contactPhone,address,emailVerified:0,userRole}); // Call the service to create a new user
    
    // Get the created user to send welcome email
    const createdUser = await getUserByEmailService(email);
    if(createdUser) {
        // Send welcome email
        await sendWelcomeEmail({
            recipientEmail: email,
            recipientName: `${firstName} ${lastName}`
        });
    }
    
    res.status(201).json({ message: newUser }); // Respond with success message

    // console.log("🌟 ~ createUser ~ newUser:", newUser)

} catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create user" });
    }
}

//Login User 
export const loginUser =async(req:Request,res:Response)=>{
    const user = req.body; // Get user credentials from request body

    try{
        const parseResult = loginValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const existingUser = await getUserByEmailService(user.email);

        if (!existingUser){
            res.status(404).json({ error: "User not found" });
            return; // Prevent further execution
        }
        // Compare the provided password with the hashed password in the database
        const isMatch = bcrypt.compareSync(user.password, existingUser.password)
        if(!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return; // Prevent further execution
        }
    
        //Genertae Token
    
        //payload- claims of the user
        let payload ={
            userId: existingUser.userId,
            email: existingUser.email,
            fullName: `${existingUser.firstName} ${existingUser.lastName}`,
            userRole: existingUser.userRole,
    
            //Expire
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expires in 1 hour
        }
    
        let secret =process.env.JWT_SECRET as string; // Get the secret from environment variables
    
    
        let token =jwt.sign(payload, secret); // Sign the token with the payload and secret
    
        res.status(200).json({ token, userId:existingUser.userId,email:existingUser.email,fullName:`${existingUser.firstName} ${existingUser.lastName}`,userRole:existingUser.userRole,profileUrl:existingUser.profilePicture}); // Respond with success message and token
    

    }catch(error:any){
        res.status(500).json({ error: error.message || "Failed to login user" });
    }

}

// Admin Create User Account
export const adminCreateUser = async (req: Request, res: Response) => {
    try {
        const parseResult = userValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        
        const { firstName, lastName, email, password, contactPhone, address, userRole } = req.body;
        if (!firstName || !lastName || !email || !password || !contactPhone || !address) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const existingUser = await getUserByEmailService(email);
        if (existingUser) {
            res.status(409).json({ error: "Email already exists" });
            return;
        }

        // Generate hashed password
        const saltRounds = 12;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = await createUserService({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactPhone,
            address,
            emailVerified: 1, // Admin created accounts are pre-verified
            userRole: userRole || 'user'
        });

        // Send welcome email
        await sendWelcomeEmail({
            recipientEmail: email,
            recipientName: `${firstName} ${lastName}`
        });

        res.status(201).json({ 
            message: "User account created successfully by admin",
            user: { firstName, lastName, email, userRole: userRole || 'user' }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to create user account" });
    }
}

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }

        const user = await getUserByEmailService(email);
        if (!user) {
            res.status(404).json({ error: "User with this email does not exist" });
            return;
        }

        // Generate reset token
        const resetToken = generateSecureToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Store reset token
        await storePasswordResetTokenService(email, resetToken, resetTokenExpiry);

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Send password reset email
        await sendPasswordResetEmail({
            recipientEmail: email,
            recipientName: `${user.firstName} ${user.lastName}`
        }, resetUrl);

        res.status(200).json({ 
            message: "Password reset email sent successfully. Please check your email." 
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to process forgot password request" });
    }
}

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            res.status(400).json({ error: "Token and new password are required" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ error: "Password must be at least 6 characters long" });
            return;
        }

        // Find user by reset token
        const user = await getUserByResetTokenService(token);
        if (!user) {
            res.status(400).json({ error: "Invalid or expired reset token" });
            return;
        }

        // Check if token is expired
        if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
            res.status(400).json({ error: "Reset token has expired" });
            return;
        }

        // Hash new password
        const saltRounds = 12;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        // Update password and clear reset token
        await updateUserPasswordService(user.userId, hashedPassword);

        // Send password reset success confirmation email
        await sendPasswordResetSuccessEmail({
            recipientEmail: user.email,
            recipientName: `${user.firstName} ${user.lastName}`
        });

        res.status(200).json({ 
            message: "Password reset successfully. A confirmation email has been sent to your email address." 
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to reset password" });
    }
}

// Send Email Verification
export const sendEmailVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }

        const user = await getUserByEmailService(email);
        if (!user) {
            res.status(404).json({ error: "User with this email does not exist" });
            return;
        }

        if (user.emailVerified === 1) {
            res.status(400).json({ error: "Email is already verified" });
            return;
        }

        // Generate verification token
        const verificationToken = generateSecureToken();
        const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours from now

        // Store verification token
        await storeEmailVerificationTokenService(user.userId, verificationToken, verificationTokenExpiry);

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000/api/auth'}/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendAccountVerificationEmail({
            recipientEmail: email,
            recipientName: `${user.firstName} ${user.lastName}`
        }, verificationUrl);

        res.status(200).json({ 
            message: "Verification email sent successfully. Please check your email." 
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to send verification email" });
    }
}

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            res.status(400).json({ error: "Verification token is required" });
            return;
        }

        // Find user by verification token
        const user = await getUserByVerificationTokenService(token);
        if (!user) {
            res.status(400).json({ error: "Invalid or expired verification token" });
            return;
        }

        // Check if token is expired
        if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
            res.status(400).json({ error: "Verification token has expired" });
            return;
        }

        // Update email verification status
        await updateEmailVerificationService(user.userId, 1);

        // Clear verification token
        await storeEmailVerificationTokenService(user.userId, '', new Date());

        // Send email verification success confirmation email
        await sendEmailVerificationSuccessEmail({
            recipientEmail: user.email,
            recipientName: `${user.firstName} ${user.lastName}`
        });

        res.status(200).json({ 
            message: "Email verified successfully! A confirmation email has been sent. You can now log in and enjoy full access to TicKenya." 
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to verify email" });
    }
}

// Resend Verification Code
export const resendVerificationCode = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }

        const user = await getUserByEmailService(email);
        if (!user) {
            res.status(404).json({ error: "User with this email does not exist" });
            return;
        }

        if (user.emailVerified === 1) {
            res.status(400).json({ error: "Email is already verified" });
            return;
        }

        // Generate new verification token
        const verificationToken = generateSecureToken();
        const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours from now

        // Store new verification token
        await storeEmailVerificationTokenService(user.userId, verificationToken, verificationTokenExpiry);

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000/api/auth'}/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendAccountVerificationEmail({
            recipientEmail: email,
            recipientName: `${user.firstName} ${user.lastName}`
        }, verificationUrl);

        res.status(200).json({ 
            message: "New verification code sent successfully. Please check your email." 
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to resend verification code" });
    }
}
