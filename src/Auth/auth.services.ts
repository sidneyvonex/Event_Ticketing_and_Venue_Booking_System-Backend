import db from "../drizzle/db"
import { TUserInsert, userTable } from "../drizzle/schema"

//Create a new user
export const createUserService = async(user:TUserInsert):Promise<string> =>{
    await db.insert(userTable).values(user).returning();
    return "User created successfully ✅";
}