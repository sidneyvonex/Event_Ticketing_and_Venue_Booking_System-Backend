import {Request,Response} from "express"
import {getAllBookingsService,getAllBookingsForOneServices,getBookingByIdService,createBookingSevice,updateBookingService,deleteBookingService} from "./booking.service"
import { bookingValidator } from "../Validation/bookingValidator";

export const getAllBookings = async(req:Request,res:Response) =>{
    try{
        const existingBookings = await getAllBookingsService();
        if(existingBookings == null || existingBookings.length ==0){
            res.status(404).json({message:"No Bookings found"})
        }else{
            res.status(200).json(existingBookings);
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to fetch Bookings"})
    }
}

export const getBookingByOneId = async(req:Request,res:Response)=>{
    const userIdParam = req.query.userId;
    const userId = typeof userIdParam === "string" ? parseInt(userIdParam,10):NaN;

    console.log("🌟 ~ getBookingByOneId ~ userId:", userId)

    
    if(isNaN(userId)){
        res.status(400).json({message:"Invalid User Id"})
        return;
    }
    try{
        const booking = await getAllBookingsForOneServices(userId);
        if(booking == null){
            res.status(404).json({message:"Bookings Not Found"})
        }else{
            res.status(200).json(booking)
        }
    }catch(error:any){
        res.status(500).json({messsage:error.message || "Failed to Fetch Bookings"})
    }
}

export const getBookingsById = async(req:Request,res:Response) =>{
    const bookingId = parseInt(req.params.id)
    if(isNaN(bookingId)){
        res.status(400).json({error:"Invalid Booking ID"})
        return; // Prevent further execution
    }
    try{
        const booking = await getBookingByIdService(bookingId);
        if(booking == undefined){
            res.status(404).json({message:"Booking not found"})
        }else{
            res.status(200).json(booking);
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to fetch Booking"})
    }
}

export const createBooking = async(req:Request,res:Response) =>{
    const {userId,eventId,quantity,totalAmount,bookingStatus} = req.body;
    if(!userId || !eventId || !quantity || !totalAmount || !bookingStatus){
        res.status(400).json({error:"All fields are required"})
        return; // Prevent further execution
    }
    try{
        const parseResult = bookingValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const newBooking = await  createBookingSevice({userId,eventId,quantity,totalAmount,bookingStatus});
        if(newBooking == null){
            res.status(500).json({message:"Failed to create Booking"})
    }else{
            res.status(201).json({message:newBooking});
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to create Booking"})
    }
}

export const updateBooking = async(req:Request,res:Response) =>{
    const bookingId = parseInt(req.params.id);
    if(isNaN(bookingId)){
        res.status(400).json({error:"Invalid Booking ID"})
        return; // Prevent further execution
    }
    const {userId,eventId,quantity,totalAmount,bookingStatus} = req.body;
    if(!userId || !eventId || !quantity || !totalAmount || !bookingStatus){
        res.status(400).json({error:"All fields are required"})
        return; // Prevent further execution
    }
    try{
        const parseResult = bookingValidator.safeParse(req.body)
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})
            return;
        } 
        const updatedBooking = await updateBookingService(bookingId,{bookingId,userId,eventId,quantity,totalAmount,bookingStatus});
        if(updatedBooking == null){
            res.status(404).json({message:"Booking not found or failed to update"});
        }else{
                res.status(200).json({message:updatedBooking});
            }
        }catch(error:any){
            res.status(500).json({error:error.message || "Failed to update Booking"})
        }
}

export const deleteBooking = async(req:Request,res:Response) =>{
    const bookingId = parseInt(req.params.id);
    if(isNaN(bookingId)){
        res.status(400).json({error:"Invalid Booking Id"});
        return; //Prevents Further Execution
    }
    try{
        const deletetedBooking = await deleteBookingService(bookingId)
        if(deletetedBooking){
            res.status(200).json({message:"Your Booking has been deleted successfully✅"})
        }else{
            res.status(404).json({message:"Booking not found"})
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failedto delete Book"})
    }
}