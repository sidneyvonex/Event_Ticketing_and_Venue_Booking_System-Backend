import { Request, Response } from "express";
import { getAllVenueServices,getVenueByIdService,updateVenueService,deleteVenueService,createVenueService } from "./venue.service";



export const getAllVenues = async (req: Request, res: Response) => {
    try {
        const existingVenues = await getAllVenueServices();
        if (existingVenues == null || existingVenues.length == 0) {
          res.status(404).json({ message: "No Venues found" });
        }else{
            res.status(200).json(existingVenues);            
        }            
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch Venues" });
    }
}
 
export const getVenueById = async (req: Request, res: Response) => {
    const venueId = parseInt(req.params.id);
    if (isNaN(venueId)) {
        res.status(400).json({ error: "Invalid Venue ID" });
         return; // Prevent further execution
    }
    try {
        const venue = await getVenueByIdService(venueId);
        if (venue == undefined) {
            res.status(404).json({ message: "Venue not found" });
        } else {
            res.status(200).json(venue);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch Venue" });
    }
}
 
export const createVenue = async (req: Request, res: Response) => {
    const { venueName,venueAddress,venueCapacity } = req.body;
    if (!venueName||!venueAddress ||!venueCapacity) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const newVenue = await createVenueService({ venueName,venueAddress,venueCapacity });
        if (newVenue == null) {
            res.status(500).json({ message: "Failed to create Venue" });
        } else {
            res.status(201).json({message:newVenue});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create Venue" });
    }
}
 
export const updateVenue = async (req: Request, res: Response) => {
    const venueId = parseInt(req.params.id);
    if (isNaN(venueId)) {
        res.status(400).json({ error: "Invalid Venue ID" });
        return; // Prevent further execution
    }
    const { venueName,venueAddress,venueCapacity } = req.body;
    if (!venueName||!venueAddress ||!venueCapacity) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedVenue = await updateVenueService(venueId, { venueName,venueAddress,venueCapacity});
        if (updatedVenue == null) {
            res.status(404).json({ message: "Venue not found or failed to update" });
        } else {
            res.status(200).json({message:updatedVenue});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to update Venue" });
    }
}
 
 
 
export const deleteVenue = async (req: Request, res: Response) => {
    const venueId = parseInt(req.params.id);  
    if (isNaN(venueId)) {
        res.status(400).json({ error: "Invalid Venue ID" });
        return; // Prevent further execution
    }
    try {
        const deletedVenue = await deleteVenueService(venueId);
        if (deletedVenue) {
            res.status(200).json({ message: "Venue deleted successfully" });
        } else {
            res.status(404).json({ message: "Venue not found" });
        }
    } catch (error:any) {    
        res.status(500).json({ error:error.message || "Failed to delete Venue" });
    }    
}