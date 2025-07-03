/**
 * @swagger
 * components:
 *   schemas:
 *     events:
 *       title: Event
 *       type: object
 *       properties:
 *         eventId:
 *           type: integer
 *           example: 1
 *         eventTitle:
 *           type: string
 *           example: AI Summit
 *         description:
 *           type: string
 *           example: A major AI conference
 *         venueId:
 *           type: integer
 *           example: 2
 *         category:
 *           type: string
 *           example: Technology
 *         eventDate:
 *           type: string
 *           format: date-time
 *           example: 2025-08-10T10:00:00Z
 *         eventTime:
 *           type: string
 *           example: 14:00:00
 *         ticketPrice:
 *           type: number
 *           format: float
 *           example: 1000.00
 *         ticketsTotal:
 *           type: integer
 *           example: 300
 *         ticketsSold:
 *           type: integer
 *           example: 200
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         emailVerified:
 *           type: boolean
 *           example: false
 *         password:
 *           type: string
 *           example: "hashedpassword123"
 *         contactPhone:
 *           type: string
 *           example: "+254712345678"
 *         address:
 *           type: string
 *           example: "Nairobi, Kenya"
 *         userRole:
 *           type: string
 *           example: "admin"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-02T10:00:00Z"
 */

