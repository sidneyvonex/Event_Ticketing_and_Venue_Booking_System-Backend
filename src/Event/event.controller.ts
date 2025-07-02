import { Request, Response } from "express";
import { getAllEventsService,getEventByIdService,createEventService,updateEventService,deleteEventService } from "./event.service";



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
    const { eventTitle,description,venueId,category,eventDate,eventTime,ticketPrice,ticketsTotal,ticketsSold } = req.body;
    if (!eventTitle||!description||!venueId||!category||!eventDate||!eventTime||!ticketPrice||!ticketsTotal||!ticketsSold) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const eventDateObj = new Date(eventDate);
        const newEvent = await createEventService({  eventTitle,description,venueId,category,eventDate: eventDateObj,eventTime,ticketPrice,ticketsTotal,ticketsSold });
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
    const { eventTitle,description,venueId,category,eventDate,eventTime,ticketPrice,ticketsTotal,ticketsSold } = req.body;
    if (!eventTitle||!description||!venueId||!category||!eventDate||!eventTime||!ticketPrice||!ticketsTotal||!ticketsSold) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const eventDateObj = new Date(eventDate);
        const updateEvent = await updateEventService(eventId, { eventTitle,description,venueId,category,eventDate:eventDateObj,eventTime,ticketPrice,ticketsTotal,ticketsSold});
        if (updateEvent == null) {
            res.status(404).json({ message: "Event not found or failed to update" });
        } else {
            res.status(200).json({message:updateEvent});
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