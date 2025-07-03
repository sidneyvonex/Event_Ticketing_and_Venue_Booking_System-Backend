import db from "../drizzle/db"
import {desc,eq} from "drizzle-orm"
import {supportTicketTable,TSupportTicketInsert,TSupportTicketSelect} from "../drizzle/schema"

export const getAllSupportTicketsService = async():Promise<TSupportTicketSelect[] | null> =>{
    return await db.query.supportTicketTable.findMany({
        orderBy:[desc(supportTicketTable.ticketId)]
    })
}

export const getSupportTicketByIdService = async(supportTicketId:number):Promise<TSupportTicketSelect | undefined> =>{
    return await db.query.supportTicketTable.findFirst({
        where: eq(supportTicketTable.ticketId, supportTicketId)
    })
}

export const createSupportTicketService = async(supportTicket:TSupportTicketInsert):Promise<string> =>{
    await db.insert(supportTicketTable).values(supportTicket).returning();
    return "Your Support Ticket has been created successfully✅"
}

export const updateSupportTicketService = async(supportTicketId:number,supportTicket:TSupportTicketInsert):Promise<string> => {
    await db.update(supportTicketTable).set(supportTicket).where(eq(supportTicketTable.ticketId,supportTicketId))
    return "Support Ticket Updated Successfully✅"
}

export const deleteSupportTicketService = async(supportTicketId:number):Promise<string> =>{
    await db.delete(supportTicketTable).where(eq(supportTicketTable.ticketId,supportTicketId))
    return "Your Support Ticket has been deleted Successfully✅"
}