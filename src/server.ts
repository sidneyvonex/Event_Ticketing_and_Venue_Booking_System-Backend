import express, { Application } from 'express';
import dotenv from 'dotenv';
import { rateLimiterMiddleware } from './Middleware/limiter';
import { logger } from './Middleware/logger';
import { swaggerSetup } from './swagger';

//importing routes
import { userRouter } from './User/user.route';
import { authRouter } from './Auth/auth.router';
import { venueRouter } from './Venue/venue.route';
import { eventRouter } from './Event/event.route';
import { bookingsRouter } from './Bookings/bookings.route';


dotenv.config(); // Load environment variables from .env file
const app:Application =express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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





// Start the server
app.listen(PORT, () => {
    console.log(`🌟🌟Server is running on http://localhost:${PORT}🌟🌟`);
});