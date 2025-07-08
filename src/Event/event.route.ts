import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from "./event.controller";
import { adminRoleAuth, bothRoleAuth, memberRoleAuth } from "../Middleware/bearAuth";

export const eventRouter = Router();

eventRouter.get('/events', getAllEvents);
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all Events
 *     description: Retrieves a list of all events
 *     security:
 *       - bearerAuth: []
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

eventRouter.get('/events/:id',memberRoleAuth, getEventById);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an Event by Id
 *     description: Retrieves an event by its unique ID
 *     security:
 *       - bearerAuth: []
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

eventRouter.post('/events', createEvent);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Adds an Event
 *     description: Used to insert a new event into the system
 *     security:
 *       - bearerAuth: []
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

eventRouter.put('/events/:id',adminRoleAuth, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Updates an Existing Event
 *     description: Used to update an event in the system
 *     security:
 *       - bearerAuth: []
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
 *             type: object
 *             properties:
 *               eventTitle:
 *                 type: string
 *                 example: "AI Summit 2025"
 *               description:
 *                 type: string
 *                 example: "A major AI conference"
 *               venueId:
 *                 type: integer
 *                 example: 3
 *               category:
 *                 type: string
 *                 example: "Technology"
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-10T10:00:00Z"
 *               eventTime:
 *                 type: string
 *                 example: "14:00:00"
 *               ticketPrice:
 *                 type: number
 *                 format: float
 *                 example: 1000.00
 *               ticketsTotal:
 *                 type: integer
 *                 example: 300
 *               ticketsSold:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */


eventRouter.delete('/events/:id',adminRoleAuth, deleteEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deletes an Existing Event
 *     description: Used to delete an event in the system
 *     security:
 *       - bearerAuth: []
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
