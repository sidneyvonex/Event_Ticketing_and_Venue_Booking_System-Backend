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