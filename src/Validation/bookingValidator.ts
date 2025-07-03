import * as z from "zod"

export const bookingValidator =z.object({
    bookingId:z.number().optional(),
    userId:z.number().int().positive().nonnegative(),
    eventId:z.number().int().positive().nonnegative(),
    quantity:z.number().min(1,"Quantity is Required").nonnegative(),
    ticketsPrice:z.coerce.number({ invalid_type_error: "ticketPrice is required" }).nonnegative("ticketPrice cannot be negative")
    .refine((val) => {
        // Check for at most two decimal places
        const str = val.toString();
        const [, decimals] = str.split(".");
        return !decimals || decimals.length <= 2;
    }, "Ticket Amount can have at most 2 decimal places")
    .refine((val) => {
        // Check precision: at most 10 digits total (up to 8 digits before decimal + 2 after)
        const digits = val.toFixed(2).replace(".", ""); // e.g. "0000001234"
        return digits.length <= 10;
    }, "Ticket Amount exceeds max precision of 10 digits"),
    bookingStatus:z.enum(["Pending", "Confirmed", "Cancelled"]).optional(),

    
})