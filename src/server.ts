import express, { Application } from 'express';
import dotenv from 'dotenv';
import { swaggerSetup } from './swagger';

//importing routes
import { userRouter } from './User/user.route';
import { authRouter } from './Auth/auth.router';


dotenv.config(); // Load environment variables from .env file
const app:Application =express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//sWagger setup
swaggerSetup(app); // Initialize Swagger documentation

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my Event Ticketing and Venue Booking System API');
}); //Default route


app.use('/api', userRouter); // User routes
app.use('/api', authRouter); // Auth routes (if needed, can be separated later)




// Start the server
app.listen(PORT, () => {
    console.log(`🌟🌟Server is running on http://localhost:${PORT}🌟🌟`);
});