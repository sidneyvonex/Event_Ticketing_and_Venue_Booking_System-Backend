import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUserService } from "./auth.services";

export const createUser = async (req: Request, res: Response) => {

    try {
        const { firstName,lastName,email,password,contactPhone,address } = req.body; //destructuring the request body
        if (!firstName||!lastName ||!email||!password||!contactPhone||!address) {
            res.status(400).json({ error: "All fields are required" });
            return; // Prevent further execution
    }
    
    //generate hashed password
    
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt with 12 rounds
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password with the generated salt

    // console.log("🌟 ~ createUser ~ hashedPassword:", hashedPassword)

    const newUser = await createUserService({firstName,lastName,email,password:hashedPassword,contactPhone,address,emailVerified:0,userRole:"user"}); // Call the service to create a new user
    res.status(201).json({ message: newUser }); // Respond with success message


} catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create user" });
    }
}
