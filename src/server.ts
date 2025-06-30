import express, { Application } from 'express';
import dotenv from 'dotenv';

//importing routes
import { userRouter } from './User/user.route';


dotenv.config(); // Load environment variables from .env file
const app:Application =express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my Event Ticketing and Venue Booking System API');
}); //Default route


app.use('/api', userRouter); // User routes




// Start the server
app.listen(PORT, () => {
    console.log(`🌟🌟Server is running on http://localhost:${PORT}🌟🌟`);
});