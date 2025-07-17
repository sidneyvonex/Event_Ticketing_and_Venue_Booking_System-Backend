import {Router} from "express"
import {createBooking,deleteBooking,updateBooking,getAllBookings,getBookingsById, getBookingByUserId} from "./bookings.controller"

export const bookingsRouter = Router();

bookingsRouter.get('/bookings',getAllBookings);

bookingsRouter.get('/bookings/user',getBookingByUserId)

bookingsRouter.get('/bookings/:id',getBookingsById);

bookingsRouter.post('/bookings',createBooking);

bookingsRouter.put('bookings/:id',updateBooking);

bookingsRouter.delete('/bookings/"id',deleteBooking);