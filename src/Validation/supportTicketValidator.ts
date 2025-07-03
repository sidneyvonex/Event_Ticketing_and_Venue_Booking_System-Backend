import * as z from "zod"

export const ticketValidator = z.object({
    ticketId:z.number().optional(),
    userId:z.number().int().positive("Must be a Positive Number").min(1,"Must be Included"),
    subject:z.string().min(1,"Subject is Required"),
    description:z.string().min(1,"Description is Required"),
    supportTicketStatus:z.enum(["Open", "In Progress", "Resolved", "Closed"])
})