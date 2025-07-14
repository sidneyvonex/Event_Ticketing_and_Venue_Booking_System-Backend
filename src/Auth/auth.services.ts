import { eq } from "drizzle-orm";
import db from "../drizzle/db"
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema"

//Create a new user
export const createUserService = async(user:TUserInsert):Promise<string> =>{
    await db.insert(userTable).values(user).returning();
    return "User created successfully";
}
//Get User by email
export const getUserByEmailService = async(email:string):Promise<TUserSelect | undefined> =>{
    return await db.query.userTable.findFirst({
        where:(eq(userTable.email,email))
    })

}