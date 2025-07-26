import { Request, Response } from "express"
import {
    getAllSupportTicketsService,
    getSupportTicketByIdService,
    getSupportTicketsByUserIdService,
    createSupportTicketService,
    updateSupportTicketService,
    deleteSupportTicketService,
    // Response services
    createSupportTicketResponseService,
    getSupportTicketResponsesService,
    getSupportTicketWithResponsesService
} from "./support.service"
import { ticketValidator } from "../Validation/supportTicketValidator";


export const getAllSupportTicket = async(req:Request,res:Response) =>{
    try{
        const existingSupportTickets = await getAllSupportTicketsService();
        if(existingSupportTickets == null || existingSupportTickets.length ==0){
            res.status(404).json({message:"No Support Tickets Found"})
        }else{
            res.status(200).json(existingSupportTickets)
        }

    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to fetch Your Support Tickets"})
    }
}
export const getSupportTicketById = async(req:Request,res:Response) =>{
    const supportTicketId = parseInt(req.params.id)
    if(isNaN(supportTicketId)){
        res.status(400).json({message:"Invalid Support Ticket"})
        return;
    }
    try{
        const selectedSupportTicket = await getSupportTicketByIdService(supportTicketId);
        if(selectedSupportTicket == undefined){
            res.status(404).json({message:"Support Ticket Not Found"})
        }else{
            res.status(200).json(selectedSupportTicket)
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to Fetch Support Ticket"})
    }
}

export const getSupportTicketsByUserId = async(req:Request,res:Response) =>{
    const userIdParam = req.query.userId;
    const userId = typeof userIdParam === "string" ? parseInt(userIdParam,10) : NaN;
    
    if(isNaN(userId)){
        res.status(400).json({message:"Invalid User Id"})
        return;
    }
    
    try{
        const userSupportTickets = await getSupportTicketsByUserIdService(userId);
        if(userSupportTickets == null || userSupportTickets.length === 0){
            res.status(404).json({message:"No Support Tickets Found for this User"})
        }else{
            res.status(200).json(userSupportTickets)
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to fetch User Support Tickets"})
    }
}

export const createSupportTicket = async(req:Request,res:Response) =>{
    const {userId,subject,description,category} = req.body
    if(!userId||!subject||!description||!category){
        res.status(400).json({message:"All fields are Required"})
        return;
    }
    try{
        const parseResult = ticketValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const newSupportTicket = await createSupportTicketService({userId,subject,description,category})
        if(newSupportTicket == null){
            res.status(500).json({message:"Failed to create Ticket"})
        }else{
            res.status(201).json(newSupportTicket)
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to create New Ticket"})
    }
}

export const updateSupportTicket = async(req:Request,res:Response) =>{
    const supportTicketId = parseInt(req.params.id)
    if(isNaN(supportTicketId)){
        res.status(400).json({message:"Invalid Ticket Id"})
        return;
    }
    
    // Only require supportTicketStatus for status updates
    const {supportTicketStatus} = req.body
    if(!supportTicketStatus){
        res.status(400).json({message:"Support ticket status is required"})
        return;
    }
    
    try{
        // Get the existing ticket first
        const existingTicket = await getSupportTicketByIdService(supportTicketId);
        if(!existingTicket){
            res.status(404).json({message:"Support Ticket Not Found"})
            return;
        }
        
        // Update only the status, keep other fields unchanged
        const updatedSupportTicket = await updateSupportTicketService(supportTicketId,{
            userId: existingTicket.userId,
            subject: existingTicket.subject,
            description: existingTicket.description,
            category: existingTicket.category,
            supportTicketStatus
        });
        
        if(updatedSupportTicket == null){
            res.status(404).json({message:"Support Ticket Not Found"})
        }else{
            res.status(200).json(updatedSupportTicket)
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to Update Support Ticket"})
    }
}

export const deleteSupportTicket = async(req:Request,res:Response) =>{
    const supportTicketId = parseInt(req.params.id)
    if(isNaN(supportTicketId)){
        res.status(400).json({message:"Invalid Support Ticket Id"})
        return;
    }
    try{
        const deletedSupportTicket = await deleteSupportTicketService(supportTicketId)
        if(deletedSupportTicket){
            res.status(200).json({message:"Your Support Ticket has been deleted Successfully"})
        }else{
            res.status(404).json({message:"Support Ticket Not Found"})
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to delete Support Ticket"})
    }
}

// ========== SUPPORT TICKET RESPONSES CONTROLLERS ==========

// Add response to a support ticket - POST /tickets/:ticketId/responses
export const addSupportTicketResponse = async(req: Request, res: Response) => {
    const ticketId = parseInt(req.params.ticketId);
    if(isNaN(ticketId)){
        res.status(400).json({message: "Invalid Ticket ID"});
        return;
    }

    const { responderId, responderType, message } = req.body;
    
    if(!responderId || !responderType || !message){
        res.status(400).json({message: "Responder ID, responder type, and message are required"});
        return;
    }

    try{
        // Verify the ticket exists
        const existingTicket = await getSupportTicketByIdService(ticketId);
        if(!existingTicket){
            res.status(404).json({message: "Support ticket not found"});
            return;
        }

        const newResponse = await createSupportTicketResponseService({
            ticketId,
            responderId,
            responderType,
            message
        });
        
        if(newResponse){
            res.status(201).json(newResponse);
        }else{
            res.status(500).json({message: "Failed to create response"});
        }
    }catch(error: any){
        res.status(500).json({error: error.message || "Failed to add response to support ticket"});
    }
}

// Get all responses for a specific ticket - GET /tickets/:ticketId/responses
export const getSupportTicketResponses = async(req: Request, res: Response) => {
    const ticketId = parseInt(req.params.ticketId);
    if(isNaN(ticketId)){
        res.status(400).json({message: "Invalid Ticket ID"});
        return;
    }

    try{
        const responses = await getSupportTicketResponsesService(ticketId);
        if(responses == null || responses.length === 0){
            res.status(404).json({message: "No responses found for this ticket"});
        }else{
            res.status(200).json(responses);
        }
    }catch(error: any){
        res.status(500).json({error: error.message || "Failed to fetch ticket responses"});
    }
}

// Get a specific ticket with all its responses - GET /tickets/:ticketId/with-responses
export const getSupportTicketWithResponses = async(req: Request, res: Response) => {
    const ticketId = parseInt(req.params.ticketId);
    if(isNaN(ticketId)){
        res.status(400).json({message: "Invalid Ticket ID"});
        return;
    }

    try{
        const ticketWithResponses = await getSupportTicketWithResponsesService(ticketId);
        if(ticketWithResponses == undefined){
            res.status(404).json({message: "Ticket not found"});
        }else{
            res.status(200).json(ticketWithResponses);
        }
    }catch(error: any){
        res.status(500).json({error: error.message || "Failed to fetch ticket with responses"});
    }
}