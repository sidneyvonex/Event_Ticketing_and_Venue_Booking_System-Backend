import {Router} from "express"
import {createBooking,deleteBooking,updateBooking,getAllBookings,getBookingsById, getBookingByUserId} from "./bookings.controller"
import { bookAndPayMpesa } from "./bookingMpesa.controller";

export const bookingsRouter = Router();

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of bookings
 *       404:
 *         description: No Bookings found
 *       500:
 *         description: Failed to fetch Bookings
 */
bookingsRouter.get('/bookings',getAllBookings);

/**
 * @swagger
 * /bookings/user:
 *   get:
 *     summary: Get bookings by userId (query param)
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: Numeric ID of the User
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of bookings for user
 *       404:
 *         description: Bookings Not Found
 *       400:
 *         description: Invalid User Id
 *       500:
 *         description: Failed to Fetch Bookings
 */
bookingsRouter.get('/bookings/user',getBookingByUserId)

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the Booking
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Invalid Booking ID
 *       500:
 *         description: Failed to fetch Booking
 */
bookingsRouter.get('/bookings/:id',getBookingsById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               eventId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *               bookingStatus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Failed to create Booking
 */
bookingsRouter.post('/bookings',createBooking);

/**
 * @swagger
 * /bookings/mpesa:
 *   post:
 *     summary: Book and pay with M-Pesa
 *     description: Creates a booking and initiates an M-Pesa STK Push payment. Booking status is set to Pending and will be updated to Confirmed after successful payment via callback.
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               eventId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking created and M-Pesa payment initiated
 *       400:
 *         description: All fields are required | Phone number must start with 254 | Failed to initiate M-Pesa payment
 *       404:
 *         description: Event not found
 *       500:
 *         description: Booking and payment failed
 */

bookingsRouter.post('/bookings/mpesa', bookAndPayMpesa);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the Booking
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               eventId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *               bookingStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated
 *       404:
 *         description: Booking not found or failed to update
 *       400:
 *         description: Invalid Booking ID | At least one field is required for update
 *       500:
 *         description: Failed to update Booking
 */
bookingsRouter.put('/bookings/:id',updateBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the Booking
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Invalid Booking Id
 *       500:
 *         description: Failed to delete Booking
 */
bookingsRouter.delete('/bookings/:id',deleteBooking);