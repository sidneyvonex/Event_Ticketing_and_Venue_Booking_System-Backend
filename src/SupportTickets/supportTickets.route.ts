import {Router} from "express"
import {getAllSupportTicket,getSupportTicketById,createSupportTicket,updateSupportTicket,deleteSupportTicket} from "./supportTickets.controller"

export const supportTicketRouter = Router();

supportTicketRouter.get('/tickets',getAllSupportTicket);

supportTicketRouter.get('/tickets/:id',getSupportTicketById);

supportTicketRouter.post('tickets',createSupportTicket);

supportTicketRouter.put('/tickets/:id',updateSupportTicket);

supportTicketRouter.delete('/tickets/:id',deleteSupportTicket);