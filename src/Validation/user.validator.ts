import {z} from 'zod';

export const userValidator = z.object({
    userId:z.number().optional(),
    firstName:z.string().nonempty().trim(),
    lastName:z.string().nonempty().trim(),
    email:z.string().nonempty().trim(),
    emailVerified:z.boolean().optional(),
    password:z.string().min(8,"Password must be atleast 8 characters").max(128,"Password must be at most 128 Characters").regex(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,"Password must contain an uppercase letter, a number, and a special character"),
    contactPhone:z.string().min(7,"Must be atleast 7 Characters"),
    address:z.string().min(1,"Address is Required"),
    userRole:z.enum(["admin","member"]).optional()
})

export const loginValidator =z.object({
    email:z.string().nonempty().trim(),
    password:z.string().trim().min(8).max(128)
})