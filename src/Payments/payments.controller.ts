import { Request, Response } from "express";
import {getAllPaymentsService,getPaymentByIdService,createPaymentService,updatePaymentService,deletePaymentService, getPaymentsForOneUser} from "./payments.service"
import { parse } from "path";

export const getAllPayments = async(req:Request,res:Response) =>{
    try{
        const existingPayments = await getAllPaymentsService();
        if(existingPayments == null || existingPayments.length == 0) {
            res.status(404).json({message:"No Payments Found"})
        }else{
            res.status(200).json(existingPayments)
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to fetch Payments"})
    }
}

export const getPaymentById = async(req:Request,res:Response) => {
    const paymentId = parseInt(req.params.id)
    if(isNaN(paymentId)){
        res.status(400).json({message:" Invalid Payment Id"})
        return; // Added missing return statement
    }
    try{
        const payment = await getPaymentByIdService(paymentId);
        if(payment == undefined){
            res.status(404).json({message:"Payment Not Found"})
        }else{
            res.status(200).json(payment)
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to Fetch Payment"}
        )
    }
}

export const getPaymentsByUserId = async(req:Request,res:Response) => {
    const userIdParam = req.query.userId;
    const userId = typeof userIdParam === "string" ? parseInt(userIdParam,10) : NaN;

    if(isNaN(userId)){
        res.status(400).json({message:"Invalid User Id"})
        return;
    }
    
    try{
        const payments = await getPaymentsForOneUser(userId);
        if(payments == null || payments.length === 0){
            res.status(404).json({message:"No Payments Found for this User"})
        }else{
            res.status(200).json(payments)
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to fetch User Payments"})
    }
}


export const createPayment = async(req:Request,res:Response) =>{
    const {bookingId,amount,paymentStatus,paymentDate,paymentMethod,transactionId}= req.body
    if(!bookingId||!amount||!paymentStatus||!paymentDate||!paymentMethod||!transactionId){
        res.status(400).json({message:"All Fields are Required"})
        return; //Prevents Further Execution
    }
    try{
        const paymentDateObj = new Date(paymentDate)
        const newPayment = await createPaymentService({bookingId,amount,paymentStatus,paymentDate:paymentDateObj,paymentMethod,transactionId})
        if(newPayment == null){
            res.status(500).json({message:"Failed to create the Payment"})
        }else{
            res.status(201).json({message:newPayment})
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to create New Payment"})
    }
}

export const updatePayment = async(req:Request,res:Response)=>{
    const paymentId = parseInt(req.params.id)
    if(isNaN(paymentId)){
        res.status(400).json({message:"Invalid Payment Id"})
        return; // Added missing return statement
    }
    
    const { bookingId, amount, paymentStatus, paymentDate, paymentMethod, transactionId } = req.body
    
    // Check if at least one field is provided for update
    if(!bookingId && !amount && !paymentStatus && !paymentDate && !paymentMethod && !transactionId){
        res.status(400).json({message:"At least one field is required for update"})
        return;
    }

    try{
        // Build the update object with only provided fields
        const updateData: any = {};
        
        if(bookingId !== undefined) updateData.bookingId = bookingId;
        if(amount !== undefined) updateData.amount = amount;
        if(paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
        if(paymentDate !== undefined) updateData.paymentDate = new Date(paymentDate);
        if(paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
        if(transactionId !== undefined) updateData.transactionId = transactionId;

        const updatedPayment = await updatePaymentService(paymentId, updateData);
        if(updatedPayment == null){
            res.status(404).json({message:"Payment Not Found"})
        }else{
            res.status(200).json({message: updatedPayment})
        }
        
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to update Payment"})
    }        
}
export const deletePayment = async(req:Request,res:Response) =>{
    const paymentId = parseInt(req.params.id)
    if(isNaN(paymentId)){
        res.status(400).json({message:"Invalid Payment Id"})
        return; // Added missing return statement
    }
    try{
        const deletedPayment = await deletePaymentService(paymentId)
        if(deletedPayment){
            res.status(200).json({message:"Your Payment has been deleted successfully"})
        }else{
            res.status(404).json({message:"Payment not found"})
        }
    }catch(error:any){
        res.status(500).json({error:error.message || "Failed to delete Payment"})
    }
}