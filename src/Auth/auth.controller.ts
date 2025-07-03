import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserService, getUserByEmailService } from "./auth.services";

export const createUser = async (req: Request, res: Response) => {

    try {
        const { firstName,lastName,email,password,contactPhone,address,userRole } = req.body; //destructuring the request body
        if (!firstName||!lastName ||!email||!password||!contactPhone||!address) {
            res.status(400).json({ error: "All fields are required" });
            return; // Prevent further execution
    }
        
    console.log(req.body)

        const existingUser = await getUserByEmailService(email);
        if (existingUser) {
        res.status(409).json({ error: "Email already in use" });
        return;
}

    //generate hashed password
    
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt with 12 rounds
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password with the generated salt

    // console.log("🌟 ~ createUser ~ hashedPassword:", hashedPassword)



    const newUser = await createUserService({firstName,lastName,email,password:hashedPassword,contactPhone,address,emailVerified:0,userRole}); // Call the service to create a new user
    res.status(201).json({ message: newUser }); // Respond with success message

    // console.log("🌟 ~ createUser ~ newUser:", newUser)



} catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create user" });
    }
}

export const loginUser =async(req:Request,res:Response)=>{
    const user = req.body; // Get user credentials from request body

    try{
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
    
        res.status(200).json({ token, userId:existingUser.userId,email:existingUser.email,fullName:`${existingUser.firstName} ${existingUser.lastName}`,userRole:existingUser.userRole}); // Respond with success message and token
    

    }catch(error:any){
        res.status(500).json({ error: error.message || "Failed to login user" });
    }

}
