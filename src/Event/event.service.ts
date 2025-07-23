
import  db from "../drizzle/db";
import { desc, eq } from "drizzle-orm";
import { eventTable,TEventSelect,TEventInsert} from "../drizzle/schema";


//CRUD Operations for Event entity
 
 
//Get all Events
export const getAllEventsService = async():Promise<TEventSelect[] | null> => {
    return await  db.query.eventTable.findMany({
      with:{
        venue:true,
      },
        orderBy:[desc(eventTable.eventId)]
    });
}

//Get Event by ID
export const getEventByIdService = async(eventId: number):Promise<TEventSelect | undefined>=> {
     return await db.query.eventTable.findFirst({
       where: eq(eventTable.eventId,eventId),
       with:{
         venue:true,
       }
     })
}

// Create a new Event
export const createEventService = async(event:TEventInsert):Promise<string> => {
      await db.insert(eventTable).values(event).returning();
       return "Event Created Successfully "
}

// Update an existing Event
export const updateEventService = async(eventId: number, event:Partial<TEventInsert>):Promise<string> => {
   await db.update(eventTable).set(event).where(eq(eventTable.eventId,eventId));
   return "Event Updated Succeffully ";
}

// Delete a Event
export const deleteEventService = async(eventId: number):Promise<boolean> => {
  const result = await db.delete(eventTable).where(eq(eventTable.eventId,eventId)).execute();
  return result.rowCount > 0
}