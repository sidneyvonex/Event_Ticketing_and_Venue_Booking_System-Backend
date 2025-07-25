import db from "../drizzle/db"
import { desc,eq } from "drizzle-orm"
import { paymentsTable,TPaymentInsert,TPaymentSelect } from "../drizzle/schema"

//CRUD OPERATIONS FOR PAYMENT ENTITY

export const getAllPaymentsService = async():Promise<TPaymentSelect[] | null> =>{
    return await db.query.paymentsTable.findMany({
        with:{
           booking:{
            columns:{
                bookingId: true,
                userId:true,
                eventId:true,
                quantity: true,
                totalAmount: true,
                bookingStatus:true,
                createdAt: true,
            },
            with: {
                user: {
                    columns: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        contactPhone: true,
                        profilePicture: true,
                    }
                },
                event: {
                    columns: {
                        eventId: true,
                        eventTitle: true,
                        description: true,
                        eventImageUrl: true,
                        category: true,
                        eventDate: true,
                        eventTime: true,
                        ticketPrice: true,
                        ticketsTotal: true,
                        ticketsSold: true,
                    },
                    with: {
                        venue: {
                            columns: {
                                venueId: true,
                                venueName: true,
                                venueAddress: true,
                                venueCapacity: true,
                            }
                        }
                    }
                }
            }
           },
        },
        orderBy:[desc(paymentsTable.paymentId)]
    })
}

export const getPaymentByIdService = async(paymentId:number):Promise<TPaymentSelect | undefined> =>{
    return await db.query.paymentsTable.findFirst({
        where:eq(paymentsTable.paymentId,paymentId)
    })
}

export const getPaymentsForOneUser = async(userId:number):Promise<TPaymentSelect[] | null> => {
    return await db.query.paymentsTable.findMany({
        with: {
            booking: {
                columns: {
                    userId: true,
                    eventId: true,
                    bookingStatus: true,
                    quantity: true,
                    totalAmount: true,
                },
                with: {
                    event: {
                        columns: {
                            eventTitle: true,
                            eventDate: true,
                            eventTime: true,
                        },
                        with:{
                            venue:{
                                columns:{
                                    venueName:true,
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: [desc(paymentsTable.paymentId)]
    }).then(payments => payments?.filter(payment => payment.booking?.userId === userId)
)
}

export const createPaymentService = async(payment:TPaymentInsert):Promise<string> =>{
    await db.insert(paymentsTable).values(payment).returning();
    return "Your Payment has been Created Successfully"
}

export const updatePaymentService = async(paymentId:number,payment:TPaymentInsert):Promise<string> =>{
    await db.update(paymentsTable).set(payment).where(eq(paymentsTable.paymentId,paymentId))
    return "Your Payment has been updated Successfully"
}

export const deletePaymentService = async(paymentId:number):Promise<string> =>{
    await db.delete(paymentsTable).where(eq(paymentsTable.paymentId,paymentId))
    return "Your Payment has been deleted Successfully"
}