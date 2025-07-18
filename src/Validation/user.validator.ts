import {z} from 'zod';

export const userValidator = z.object({
    userId:z.number().optional(),
    firstName:z.string().nonempty().trim(),
    lastName:z.string().nonempty().trim(),
    email:z.string().nonempty().trim().regex(/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i, "Invalid email format"),
    emailVerified:z.boolean().optional(),
    password:z.string().min(8,"Password must be atleast 8 characters").max(128,"Password must be at most 128 Characters").regex(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,"Password must contain an uppercase letter, a number, and a special character"),
    contactPhone:z.string().min(7,"Must be atleast 7 Characters"),
    address:z.string().min(1,"Address is Required"),
    userRole:z.enum(["admin","user"]).optional()
})

export const userUpdateValidator = z.object({
    firstName:z.string().nonempty().trim().optional(),
    lastName:z.string().nonempty().trim().optional(),
    email:z.string().nonempty().trim().regex(/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i, "Invalid email format").optional(),
    password:z.string().min(8,"Password must be atleast 8 characters").max(128,"Password must be at most 128 Characters").regex(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,"Password must contain an uppercase letter, a number, and a special character").optional(),
    contactPhone:z.string().min(7,"Must be atleast 7 Characters").optional(),
    address:z.string().min(1,"Address is Required").optional(),
    userRole:z.enum(["admin","user"]).optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
})

export const loginValidator =z.object({
    email:z.string().nonempty().trim().regex(/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i, "Invalid email format"),
    password:z.string().trim().min(8).max(128)
})