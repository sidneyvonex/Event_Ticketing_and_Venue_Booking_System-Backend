import db from "../drizzle/db"
import {desc,eq} from "drizzle-orm"
import {supportTicketTable,TSupportTicketInsert,TSupportTicketSelect, supportTicketRepliesTable, TSupportTicketReplyInsert, TSupportTicketReplySelect} from "../drizzle/schema"

export const getAllSupportTicketsService = async():Promise<TSupportTicketSelect[] | null> =>{
    return await db.query.supportTicketTable.findMany({
        with:{
            user:{
                columns:{
                    firstName:true,
                    lastName:true,
                    email:true,
                }
            }
        },
        orderBy:[desc(supportTicketTable.ticketId)]
    })
}

export const getSupportTicketByIdService = async(supportTicketId:number):Promise<TSupportTicketSelect | undefined> =>{
    return await db.query.supportTicketTable.findFirst({
        where: eq(supportTicketTable.ticketId, supportTicketId)
    })
}

export const getSupportTicketsByUserIdService = async(userId:number):Promise<TSupportTicketSelect[] | null> =>{
    return await db.query.supportTicketTable.findMany({
        where: eq(supportTicketTable.userId, userId),
        with:{
            user:{
                columns:{
                    firstName:true,
                    lastName:true,
                    email:true,
                }
            }
        },
        orderBy:[desc(supportTicketTable.ticketId)]
    })
}

export const createSupportTicketService = async(supportTicket:TSupportTicketInsert):Promise<string> =>{
    await db.insert(supportTicketTable).values(supportTicket).returning();
    return "Your Support Ticket has been created successfully"
}

export const updateSupportTicketService = async(supportTicketId:number,supportTicket:TSupportTicketInsert):Promise<string> => {
    await db.update(supportTicketTable).set(supportTicket).where(eq(supportTicketTable.ticketId,supportTicketId))
    return "Support Ticket Updated Successfully"
}

export const deleteSupportTicketService = async(supportTicketId:number):Promise<string> =>{
    await db.delete(supportTicketTable).where(eq(supportTicketTable.ticketId,supportTicketId))
    return "Your Support Ticket has been deleted Successfully"
}

// ========== SUPPORT TICKET RESPONSES SERVICES ==========

// Create a new response to a support ticket
export const createSupportTicketResponseService = async(ticketResponse: TSupportTicketReplyInsert): Promise<string> => {
    await db.insert(supportTicketRepliesTable).values(ticketResponse).returning();
    return "Support ticket response added successfully";
}

// Get all responses for a specific ticket
export const getSupportTicketResponsesService = async(ticketId: number): Promise<TSupportTicketReplySelect[] | null> => {
    return await db.query.supportTicketRepliesTable.findMany({
        where: eq(supportTicketRepliesTable.ticketId, ticketId),
        with: {
            responder: {
                columns: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    userRole: true,
                }
            }
        },
        orderBy: [desc(supportTicketRepliesTable.createdAt)]
    });
}

// Get a specific ticket with all its responses
export const getSupportTicketWithResponsesService = async(ticketId: number): Promise<TSupportTicketSelect | undefined> => {
    return await db.query.supportTicketTable.findFirst({
        where: eq(supportTicketTable.ticketId, ticketId),
        with: {
            user: {
                columns: {
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            },
            responses: {
                with: {
                    responder: {
                        columns: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            userRole: true,
                        }
                    }
                },
                orderBy: [desc(supportTicketRepliesTable.createdAt)]
            }
        }
    });
}

// Get a specific response by ID
export const getSupportTicketResponseByIdService = async(responseId: number): Promise<TSupportTicketReplySelect | undefined> => {
    return await db.query.supportTicketRepliesTable.findFirst({
        where: eq(supportTicketRepliesTable.responseId, responseId),
        with: {
            responder: {
                columns: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    userRole: true,
                }
            },
            ticket: {
                columns: {
                    ticketId: true,
                    subject: true,
                    supportTicketStatus: true,
                }
            }
        }
    });
}

// Update a support ticket response
export const updateSupportTicketResponseService = async(responseId: number, responseData: Partial<TSupportTicketReplyInsert>): Promise<string> => {
    await db.update(supportTicketRepliesTable).set(responseData).where(eq(supportTicketRepliesTable.responseId, responseId));
    return "Support ticket response updated successfully";
}

// Delete a support ticket response
export const deleteSupportTicketResponseService = async(responseId: number): Promise<string> => {
    await db.delete(supportTicketRepliesTable).where(eq(supportTicketRepliesTable.responseId, responseId));
    return "Support ticket response deleted successfully";
}