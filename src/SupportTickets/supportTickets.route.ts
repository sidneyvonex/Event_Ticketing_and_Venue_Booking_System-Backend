import {Router} from "express"
import {
    getAllSupportTicket,
    getSupportTicketById,
    getSupportTicketsByUserId,
    createSupportTicket,
    updateSupportTicket,
    deleteSupportTicket,
    // Response controllers
    addSupportTicketResponse,
    getSupportTicketResponses,
    getSupportTicketWithResponses
} from "./supportTickets.controller"

export const supportTicketRouter = Router();

// ========== SUPPORT TICKET ROUTES ==========
supportTicketRouter.get('/tickets',getAllSupportTicket);

supportTicketRouter.get('/tickets/user',getSupportTicketsByUserId);

supportTicketRouter.get('/tickets/:id',getSupportTicketById);

supportTicketRouter.post('/tickets',createSupportTicket);

supportTicketRouter.put('/tickets/:id',updateSupportTicket);

supportTicketRouter.delete('/tickets/:id',deleteSupportTicket);

// ========== SUPPORT TICKET RESPONSE ROUTES ==========
// Add response to a support ticket
supportTicketRouter.post('/tickets/:ticketId/responses', addSupportTicketResponse);

// Get all responses for a specific ticket
supportTicketRouter.get('/tickets/:ticketId/responses', getSupportTicketResponses);

// Get a specific ticket with all its responses
supportTicketRouter.get('/tickets/:ticketId/with-responses', getSupportTicketWithResponses);