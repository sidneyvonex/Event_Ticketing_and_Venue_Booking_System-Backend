import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from "./event.controller";

export const eventRouter = Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all Events
 *     description: Retrieves a list of all events
 *     tags: [Events]
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
eventRouter.get('/events', getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an Event by Id
 *     description: Retrieves an event by its unique ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the event to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 *       404:
 *         description: Event not found
 */
eventRouter.get('/events/:id', getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Adds an Event
 *     description: Used to insert a new event into the system
 *     tags: [Events]
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
eventRouter.post('/events', createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Updates an Existing Event
 *     description: Used to update an event in the system
 *     tags: [Events]
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
eventRouter.put('/events/:id', updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deletes an Existing Event
 *     description: Used to delete an event in the system
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the event to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid Event ID
 *       500:
 *         description: Internal server error
 */
eventRouter.delete('/events/:id', deleteEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deletes an Existing Event
 *     description: Used to delete an event in the system
 *     tags: [Events]
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
 *         description: Internal server error
 */