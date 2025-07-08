import * as z from "zod"

export const eventValidator = z.object({
    eventId:z.number().optional(),
    eventTitle:z.string().min(1,"Event Title is Required"),
    description:z.string().min(1,"Description is Required"),
    venueId:z.number().int().positive("Venue Id must be a Positive Integer"),
    category:z.string().min(1,"Category Name is Required"),
    eventDate: z.coerce.date().refine((d) => !isNaN(d.getTime()),{
        message:"Event Date must be a Valid Date"
    }),
    ticketPrice:z.coerce.number({ invalid_type_error: "ticketPrice is required" }).nonnegative("ticketPrice cannot be negative")
    .refine((val) => {
      // Check for at most two decimal places
      const str = val.toString();
      const [, decimals] = str.split(".");
      return !decimals || decimals.length <= 2;
    }, "ticketPrice can have at most 2 decimal places")
    .refine((val) => {
      // Check precision: at most 10 digits total (up to 8 digits before decimal + 2 after)
      const digits = val.toFixed(2).replace(".", ""); // e.g. "0000001234"
      return digits.length <= 10;
    }, "ticketPrice exceeds max precision of 10 digits"),
    ticketsTotal:z.coerce.number({invalid_type_error:"Tickets Total is Required and must be a Number"}).int().nonnegative(),
    ticketsSold: z.number({ invalid_type_error: "Tickets Sold must be a Number" }).int().nonnegative().optional().default(0)
})