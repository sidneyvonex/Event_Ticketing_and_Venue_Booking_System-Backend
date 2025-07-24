import { Request, Response } from "express";
import { getAllEventsService,getEventByIdService,createEventService,updateEventService,deleteEventService } from "./event.service";
import { eventValidator } from "../Validation/eventValidator";
import { TEventInsert } from "../drizzle/schema";



export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const existingEvents = await getAllEventsService();
        if (existingEvents == null || existingEvents.length == 0) {
          res.status(404).json({ message: "No Events found" });
        }else{
            res.status(200).json(existingEvents);            
        }            
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch Events" });
    }
}
 
export const getEventById = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
        res.status(400).json({ error: "Invalid Event ID" });
         return; // Prevent further execution
    }
    try {
        const event = await getEventByIdService(eventId);
        if (event == undefined) {
            res.status(404).json({ message: "Event not found" });
        } else {
            res.status(200).json(event);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch Event" });
    }
}
 
export const createEvent = async (req: Request, res: Response) => {
    const { eventTitle,description,venueId,category,eventDate,eventTime,ticketPrice,ticketsTotal,ticketsSold,eventImageUrl } = req.body;

// And update the validation to include eventImageUrl (make it optional since it might be empty):
if (!eventTitle||!description||!venueId||!category||!eventDate||!eventTime||!ticketPrice||!ticketsTotal||ticketsSold === undefined) {
    res.status(400).json({ error: "All fields are required" });
    return;
}
    try {
        const parseResult = eventValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const eventDateObj = new Date(eventDate);
        const newEvent = await createEventService({ 
  eventTitle, 
  description, 
  venueId, 
  category, 
  eventDate: eventDateObj, 
  eventTime, 
  ticketPrice, 
  ticketsTotal, 
  ticketsSold,
  eventImageUrl 
});
        if (newEvent == null) {
            res.status(500).json({ message: "Failed to create Event" });
        } else {
            res.status(201).json({message:newEvent});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create Event" });
    }
}
 
export const updateEvent = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
        res.status(400).json({ error: "Invalid Event ID" });
        return; // Prevent further execution
    }
    
    // Extract fields from request body (any combination is allowed)
    const { eventTitle,description,venueId,category,eventDate,eventTime,ticketPrice,ticketsTotal } = req.body;
    
    // Check if at least one field is provided for update
    if (!eventTitle && !description && !venueId && !category && !eventDate && !eventTime && !ticketPrice && !ticketsTotal) {
        res.status(400).json({ error: "At least one field is required for update" });
        return; // Prevent further execution
    }
    
    try {
        // Only validate provided fields
        const updateData: Partial<TEventInsert> = {};
        if (eventTitle !== undefined) updateData.eventTitle = eventTitle;
        if (description !== undefined) updateData.description = description;
        if (venueId !== undefined) updateData.venueId = venueId;
        if (category !== undefined) updateData.category = category;
        if (eventDate !== undefined) updateData.eventDate = new Date(eventDate);
        if (eventTime !== undefined) updateData.eventTime = eventTime;
        if (ticketPrice !== undefined) updateData.ticketPrice = ticketPrice;
        if (ticketsTotal !== undefined) updateData.ticketsTotal = ticketsTotal;
        
        const parseResult = eventValidator.partial().safeParse(updateData)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        
        const updatedEvent = await updateEventService(eventId, updateData);
        if (updatedEvent == null) {
            res.status(404).json({ message: "Event not found or failed to update" });
        } else {
            res.status(200).json({message:updatedEvent});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to update Event" });
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);  
    if (isNaN(eventId)) {
        res.status(400).json({ error: "Invalid Event ID" });
        return; // Prevent further execution
    }
    try {
        const deletedEvent = await deleteEventService(eventId);
        if (deletedEvent) {
            res.status(200).json({ message: "Event deleted successfully" });
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error:any) {    
        res.status(500).json({ error:error.message || "Failed to delete Event" });
    }    
}