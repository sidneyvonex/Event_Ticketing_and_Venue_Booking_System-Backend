import { Request, Response } from "express"
import {getAllSupportTicketsService,getSupportTicketByIdService,getSupportTicketsByUserIdService,createSupportTicketService,updateSupportTicketService,deleteSupportTicketService} from "./support.service"
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
        res.status(500).json({message:"Invalid Ticket Id"})
        return;
    }
    const {userId,subject,description,category,supportTicketStatus} = req.body
    if(!userId||!subject||!description||!supportTicketStatus){
        res.status(400).json({message:"All fields are Required"})
        return;
    }
    try{
        const parseResult = ticketValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const updatedSupportTicket = await updateSupportTicketService(supportTicketId,{userId,subject,description,category,supportTicketStatus});
        if(updatedSupportTicket == null){
            res.status(404).json({message:"Support Ticket Not Found"})
        }else{
            res.status(200).json({message:updatedSupportTicket})
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