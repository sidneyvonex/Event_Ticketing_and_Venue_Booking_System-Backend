import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller";
import { adminRoleAuth,bothRoleAuth, memberRoleAuth } from "../Middleware/bearAuth";


export const userRouter = Router();

// User routes definition
// Get all users
userRouter.get('/users',adminRoleAuth, getUsers);
//Swagger documentation for GET
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users (admin access only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 */


// Get user by ID
userRouter.get('/users/:id',memberRoleAuth, getUserById);
//Swagger documentation for GET by ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get User By ID
 *     description: Fetch a single user by their ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/events'
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
userRouter.put('/users/:id',bothRoleAuth,updateUser);

//Swagger documentation for Update
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Updates an Existing User (Admin and Member Access)
 *     description: Used to update an User in the system
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the User to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: "string"
 *                   example: "johndoe@email.com"
 *                 contactPhone:
 *                   type: varchar
 *                   example: "123-456-7890"
 *                 address:
 *                   type: string
 *                   example: "123 Main St, City, Country"
 *                 userRole:
 *                   type: string
 *                   example: "admin"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 */



// Delete an existing user
userRouter.delete('/users/:id', adminRoleAuth,deleteUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletes an Existing User
 *     description: Used to delete a user in the system
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the User to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid User ID
 *       500:
 *         description: Failed to delete User
 */

