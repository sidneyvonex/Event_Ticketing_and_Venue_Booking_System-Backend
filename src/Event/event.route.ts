import { Router } from "express"
import {getAllEvents,getEventById,createEvent,updateEvent,deleteEvent} from "./event.controller"

export const eventRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     events:
 *       type: object
 *       properties:
 *         eventId:
 *           type: integer
 *         eventTitle:
 *           type: string
 *         description:
 *           type: string
 *         venueId:
 *           type: integer
 *         category:
 *           type: string
 *         eventDate:
 *           type: string
 *           format: date-time
 *         eventTime:
 *           type: string
 *           example: "14:00:00"
 *         ticketPrice:
 *           type: number
 *           format: float
 *         ticketsTotal:
 *           type: integer
 *         ticketsSold:
 *           type: integer
 */

//Get all events
eventRouter.get('/events', getAllEvents);
/**
 * @swagger
 * components:
 *   schemas:
 *     events:
 *       type: object
 *       properties:
 *         eventId:
 *           type: integer
 *         eventTitle:
 *           type: string
 *         description:
 *           type: string
 *         venueId:
 *           type: integer
 *         category:
 *           type: string
 *         eventDate:
 *           type: string
 *           format: date-time
 *         eventTime:
 *           type: string
 *           example: "14:00:00"
 *         ticketPrice:
 *           type: number
 *           format: float
 *         ticketsTotal:
 *           type: integer
 *         ticketsSold:
 *           type: integer
 */

//Get all events
eventRouter.get('/events', getAllEvents);

//Swagger Documentation for Get all Events
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an Event by Id
 *     description: Retrieves an Event According to Id
 *     parameters:
 *          - in: path
 *            name:id
 *            required: true
 *            description: Numeric ID Required
 *            schema:
 *              type:integer
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/events'
 */


//Get event by ID
eventRouter.get('/events/:id', getEventById);
//Swagger Documentation for GetEvent By Id
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all Events
 *     description: Retrieves a list of all events
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/events'
 */

//Create a new event
eventRouter.post('/events', createEvent);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Adds an Event
 *     description: Used to insert a new event into the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/events'
 *     responses:
 *       201:
 *         description: Event added successfully
 */


//Update an existing event
eventRouter.put('/events/:id', updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Updates an Existing Event
 *     description: Used to update an event in the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the event to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/events'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 */

//Delete an event
eventRouter.delete('/events/:id', deleteEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deletes an Existing Event
 *     description: Used to delete an event in the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the event to Delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event Deleted successfully
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid Event ID
 *       500:
 *         description: Failed to delete Event
 */