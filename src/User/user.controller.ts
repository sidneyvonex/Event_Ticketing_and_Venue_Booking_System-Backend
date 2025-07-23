import { Request, Response } from "express";
import { getUsersServices, getUserByIdServices, createUserServices, updateUserServices, deleteUserServices, changePasswordService, updateProfilePictureService } from "./user.service";
import { userValidator, userUpdateValidator } from "../Validation/user.validator";
import { formatDate } from "../utils/formatDate";
import bcrypt from "bcrypt";



export const getUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await getUsersServices();
        if (allUsers == null || allUsers.length == 0) {
          res.status(404).json({ message: "No users found" });
        }else{
            // Remove password from each user object before sending response
            const usersWithoutPasswords = allUsers.map(({ password, ...user }) => ({
                ...user,
                createdAt: formatDate(user.createdAt),
                updatedAt: formatDate(user.updatedAt), 
            }));
            res.status(200).json(usersWithoutPasswords);         
        }            
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch users" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
         return; // Prevent further execution
    }
    try {
        const user = await getUserByIdServices(userId);
        if (user == undefined) {
            res.status(404).json({ message: "User not found" });
        } else {
            // Remove password from user object before sending response
            const { password, ...userWithoutPassword } = user;
            const formattedUser = {
                ...userWithoutPassword,
                createdAt: formatDate(user.createdAt),
                updatedAt: formatDate(user.updatedAt),
            };
            res.status(200).json(formattedUser);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch user" });
    }
}
 
export const createUser = async (req: Request, res: Response) => {
    

    const { firstName,lastName,email,password,contactPhone,address } = req.body;
    if (!firstName||!lastName ||!email||!password||!contactPhone||!address) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }

    try {
        const parseResult = userValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const newUser = await createUserServices({ firstName,lastName,email,password,contactPhone,address});
        if (newUser == null) {
            res.status(500).json({ message: "Failed to create user" });
        } else {
            res.status(201).json({message:newUser});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create user" });
    }
}
 
export const updateUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return; // Prevent further execution
    }
    
    try {
        // Validate the request body with the update validator
        const parseResult = userUpdateValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        // Only include fields that were provided in the request
        const updateData = parseResult.data;

        const updatedUser = await updateUserServices(userId, updateData);
        if (updatedUser == null) {
            res.status(404).json({ message: "User not found or failed to update" });
        } else {
            res.status(200).json({message: updatedUser});
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message || "Failed to update user" });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);  
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return; // Prevent further execution
    }
    try {
        const deletedUser = await deleteUserServices(userId);
        if (deletedUser) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error:any) {    
        res.status(500).json({ error:error.message || "Failed to delete user" });
    }    
}

export const changePassword = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Current password and new password are required" });
        return;
    }

    if (newPassword.length < 6) {
        res.status(400).json({ error: "New password must be at least 6 characters long" });
        return;
    }

    try {
        // First, get the user to verify current password
        const user = await getUserByIdServices(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            res.status(400).json({ error: "Current password is incorrect" });
            return;
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const result = await changePasswordService(userId, hashedNewPassword);
        res.status(200).json({ message: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to change password" });
    }
}

export const updateProfilePicture = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    const { profilePictureUrl } = req.body;
    if (!profilePictureUrl) {
        res.status(400).json({ error: "Profile picture URL is required" });
        return;
    }

    try {
        // Check if user exists
        const user = await getUserByIdServices(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const result = await updateProfilePictureService(userId, profilePictureUrl);
        res.status(200).json({ message: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update profile picture" });
    }
}