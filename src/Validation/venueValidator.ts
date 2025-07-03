import * as z from "zod"

export const venueValidator = z.object({
    venueId:z.number().optional(),
    venueName:z.string().min(1,"Venue Name is Required").trim(),
    venueAddress:z.string().min(1,"Venue Address is Required").trim(),
    venueCapacity:z.number().min(1,"Venue Capacity is Required"),
})
