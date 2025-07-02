
import  db from "../drizzle/db";
import { desc, eq } from "drizzle-orm";
import { userTable,TUserInsert,TUserSelect } from "../drizzle/schema";


//CRUD Operations for User entity
 
 
//Get all users
export const getUsersServices = async():Promise<TUserSelect[] | null> => {
    return await  db.query.userTable.findMany({
      orderBy:[desc(userTable.userId)]
    });
}

//Get user by ID
export const getUserByIdServices = async(userId: number):Promise<TUserSelect | undefined>=> {
     return await db.query.userTable.findFirst({
       where: eq(userTable.userId,userId)
     })
}

// Create a new user
export const createUserServices = async(user:TUserInsert):Promise<string> => {
      await db.insert(userTable).values(user).returning();
       return "User Created Successfully 😎"
}

// Update an existing user
export const updateUserServices = async(userId: number, user:TUserInsert):Promise<string> => {
   await db.update(userTable).set(user).where(eq(userTable.userId,userId));
   return "User Updated Succeffully 😎";
}


export const deleteUserServices = async(userId: number):Promise<string> => {
  await db.delete(userTable).where(eq(userTable.userId,userId));
  return "User Delete Sucessfully";
}