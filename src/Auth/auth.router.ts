import {Router } from "express";
import { 
    createUser, 
    loginUser, 
    adminCreateUser, 
    forgotPassword, 
    resetPassword, 
    sendEmailVerification, 
    verifyEmail, 
    resendVerificationCode 
} from "./auth.controller";
import { adminRoleAuth,bothRoleAuth,memberRoleAuth } from "../Middleware/bearAuth";

export const authRouter = Router();

authRouter.post('/auth/register',memberRoleAuth,createUser)

//Swagger documentation for POST
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request or validation error
 */
authRouter.post('/auth/login',loginUser);
//Swagger documentation for POST
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logging In a user
 *     description: Authenticates a user and returns a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *               type: string
 *               example: "john@example.com"
 *              password:
 *               type: string
 *               example: "password123"
 *     responses:
 *       200:
 *         description: User Logged In successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                 userRole:
 *                   type: string
 *                   example: "admin"
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Failed to login user
 */

// Admin Create User Account
authRouter.post('/auth/admin/create-user', adminRoleAuth, adminCreateUser);
/**
 * @swagger
 * /auth/admin/create-user:
 *   post:
 *     summary: Admin creates a user account
 *     description: Allows admin to create a user account with pre-verified email
 *     security:
 *       - bearerAuth: []
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User account created successfully by admin
 *       400:
 *         description: Bad request or validation error
 *       409:
 *         description: Email already exists
 *       403:
 *         description: Access denied - Admin role required
 */

// Forgot Password
authRouter.post('/auth/forgot-password', forgotPassword);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: User with this email does not exist
 *       500:
 *         description: Failed to process forgot password request
 */

// Reset Password
authRouter.post('/auth/reset-password', resetPassword);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     description: Resets user password using the token received via email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "resetTokenHere"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token, or password too short
 *       500:
 *         description: Failed to reset password
 */

// Send Email Verification
authRouter.post('/auth/send-verification', sendEmailVerification);
/**
 * @swagger
 * /auth/send-verification:
 *   post:
 *     summary: Send email verification
 *     description: Sends an email verification link to the user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       400:
 *         description: Email is required or already verified
 *       404:
 *         description: User with this email does not exist
 *       500:
 *         description: Failed to send verification email
 */

// Verify Email
authRouter.post('/auth/verify-email', verifyEmail);
/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     description: Verifies user email using the token received via email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "verificationTokenHere"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 *       500:
 *         description: Failed to verify email
 */

// Resend Verification Code
authRouter.post('/auth/resend-verification', resendVerificationCode);
/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification code
 *     description: Resends email verification code to the user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: New verification code sent successfully
 *       400:
 *         description: Email is required or already verified
 *       404:
 *         description: User with this email does not exist
 *       500:
 *         description: Failed to resend verification code
 */