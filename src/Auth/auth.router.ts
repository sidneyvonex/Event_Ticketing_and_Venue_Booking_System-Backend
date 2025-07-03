import {Router } from "express";
import { createUser, loginUser } from "./auth.controller";

export const authRouter = Router();

authRouter.post('/auth/register',createUser)

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