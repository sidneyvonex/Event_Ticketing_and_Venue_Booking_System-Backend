import express, { Application } from 'express';
import { rateLimiterMiddleware } from './Middleware/limiter';
import { logger } from './Middleware/logger';
import { swaggerSetup } from './swagger';
import cors from "cors"

//importing routes
import { userRouter } from './User/user.route';
import { authRouter } from './Auth/auth.router';
import { venueRouter } from './Venue/venue.route';
import { eventRouter } from './Event/event.route';
import { bookingsRouter } from './Bookings/bookings.route';
import { paymentRouter } from './Payments/payment.route';
import { supportTicketRouter } from './SupportTickets/supportTickets.route';

const app:Application =express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Rate Limiter Middleware
app.use(rateLimiterMiddleware);

//Logging Middleware
app.use(logger);

//sWagger setup
swaggerSetup(app); // Initialize Swagger documentation

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my Event Ticketing and Venue Booking System API');
}); //Default route



app.use('/api', userRouter); // User routes
app.use('/api', authRouter); // Auth routes 
app.use('/api',venueRouter); // Venue routes
app.use('/api',eventRouter); // Event routes
app.use('/api',bookingsRouter);//Bookings routes
app.use('/api',paymentRouter); // Payment routes
app.use('/api',supportTicketRouter)//Support Ticket Routes


export default app;