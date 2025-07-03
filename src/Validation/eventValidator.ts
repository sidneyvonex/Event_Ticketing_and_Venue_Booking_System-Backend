import * as z from "zod"

export const eventValidator = z.object({
    eventId:z.number().optional(),
    
})