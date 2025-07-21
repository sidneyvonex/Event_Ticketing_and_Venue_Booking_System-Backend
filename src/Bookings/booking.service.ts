import db from "../drizzle/db";
import { desc, eq } from "drizzle-orm";
import { bookingTable, TBookingSelect, TBookingInsert } from "../drizzle/schema";

//CRUD OPERATIONS FOR BOOKING ENTITY

//Get all bookings

export const getAllBookingsService = async():Promise<TBookingSelect[] |null> =>{
    return await db.query.bookingTable.findMany({
        with:{
            user:{
                columns:{
                    firstName:true,
                    lastName:true,
                    email:true,
                }
            },
            payments:true
        },

        orderBy:[desc(bookingTable.userId)]
    })
}

//GET All Bookings for One User
export const getAllBookingsForOneUserService= async(userId:number):Promise<TBookingSelect[] |  null> =>{
    return await db.query.bookingTable.findMany({
        where:eq(bookingTable.userId,userId),
        with:{
            event:{
                columns:{
                    eventTitle:true,
                    eventDate:true,
                    eventTime:true,
                    ticketsTotal:true,
                    ticketPrice:true,
                },
                with:{
                    venue:{
                        columns:{
                            venueName:true
                        }
                    }
                }
            }
        },
        orderBy:[desc(bookingTable.bookingId)]
    })
}

//Get Booking by Id

export const getBookingByIdService =async(bookingId:number):Promise<TBookingSelect | undefined> =>{
    return await db.query.bookingTable.findFirst({
        where:eq(bookingTable.bookingId,bookingId)
    })
}

//Create a new Booking
export const createBookingSevice = async(booking:TBookingInsert):Promise<string> =>{
    await db.insert(bookingTable).values(booking).returning();
    return "Your booking has been created successfully"
}

//Update a booking
export const updateBookingService = async(bookingId:number,booking:Partial<TBookingInsert>):Promise<string> => {
    await db.update(bookingTable).set(booking).where(eq(bookingTable.bookingId,bookingId));
    return "Your Booking has been Updated Successfully"
}
//delete a booking
export const deleteBookingService = async(bookingId:number):Promise<string> => {
    await db.delete(bookingTable).where(eq(bookingTable.bookingId,bookingId))
    return "Your Booking has been deleted successfully"
}