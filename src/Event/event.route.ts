import { Router } from "express"
import {getAllEvents,getEventById,createEvent,updateEvent,deleteEvent} from "./event.controller"

export const eventRouter = Router();

//Get all events
eventRouter.get('/events', getAllEvents);

//Get event by ID
eventRouter.get('/events/:id', getEventById);

//Create a new event
eventRouter.post('/events', createEvent);

//Update an existing event
eventRouter.put('/events/:id', updateEvent);

//Delete an event
eventRouter.delete('/events/:id', deleteEvent);