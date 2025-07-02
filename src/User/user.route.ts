import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller";
// import { adminRoleAuth } from "../Middleware/bearAuth";

 
export const userRouter = Router();
 

/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: integer
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  email:
 *                      type: string
 *                  emailVerified:
 *                      type: integer
 *                  contactPhone:
 *                      type: string
 *                  address:
 *                      type: string
 *                  userRole:
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                  updatedAt:
 *                     type: string
 */
// User routes definition

// Get all users
userRouter.get('/users',/*adminRoleAuth,*/ getUsers);
//Swagger documentation for GET
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users (admin access only)
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
 
// Get user by ID
userRouter.get('/users/:id', getUserById);
//Swagger documentation for GET by ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get User By ID
 *     description: Fetch a single user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */


// Create a new user
userRouter.post('/users', createUser);


// Update an existing user
userRouter.put('/users/:id',updateUser);

 
// Delete an existing user
userRouter.delete('/users/:id', deleteUser);


