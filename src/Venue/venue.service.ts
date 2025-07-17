
import  db from "../drizzle/db";
import { desc, eq } from "drizzle-orm";
import { venueTable,TVenueSelect,TVenueInsert } from "../drizzle/schema";


//CRUD Operations for Venue entity
 
 
//Get all Venues
export const getAllVenueServices = async():Promise<TVenueSelect[] | null> => {
    return await  db.query.venueTable.findMany({
      with:{
          events:{
            columns:{
              eventTitle:true,
              eventDate:true,
            },
            with:{
              bookings:{
                columns:{
                  bookingStatus:true,
                  
                }
              }
            }
          }
      },
        orderBy:[desc(venueTable.venueId)]
    });
}

//Get venue by ID
export const getVenueByIdService = async(venueId: number):Promise<TVenueSelect | undefined>=> {
     return await db.query.venueTable.findFirst({
       where: eq(venueTable.venueId,venueId)
     })
}

// Create a new Venue
export const createVenueService = async(venue:TVenueInsert):Promise<string> => {
      await db.insert(venueTable).values(venue).returning();
       return "Venue Created Successfully"
}

// Update an existing Venue
export const updateVenueService = async(venueId: number, venue:TVenueInsert):Promise<string> => {
   await db.update(venueTable).set(venue).where(eq(venueTable.venueId,venueId));
   return "Venue Updated Succeffully ";
}

// Delete a Venue
export const deleteVenueService = async(venueId: number):Promise<string> => {
  await db.delete(venueTable).where(eq(venueTable.venueId,venueId));
  return "Venue Delete Sucessfully";
}