import { Router } from "express";
import { createVenue, deleteVenue, getVenueById, updateVenue,getAllVenues} from "./venue.controller";

export const venueRouter = Router();

//Get all venues
venueRouter.get('/venues', getAllVenues);

//Get venue by ID
venueRouter.get('/venues/:id', getVenueById);

//Create a new venue
venueRouter.post('/venues', createVenue);

//Update an existing venue
venueRouter.put('/venues/:id', updateVenue);

//Delete a venue
venueRouter.delete('/venues/:id', deleteVenue);