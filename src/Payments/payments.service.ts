import db from "../drizzle/db"
import { desc,eq } from "drizzle-orm"
import { paymentsTable,TPaymentInsert,TPaymentSelect } from "../drizzle/schema"

//CRUD OPERATIONS FOR PAYMENT ENTITY

export const getAllPaymentsService = async():Promise<TPaymentSelect[] | null> =>{
    return await db.query.paymentsTable.findMany({
        orderBy:[desc(paymentsTable.paymentId)]
    })
}

export const getPaymentByIdService = async(paymentId:number):Promise<TPaymentSelect | undefined> =>{
    return await db.query.paymentsTable.findFirst({
        where:eq(paymentsTable.paymentId,paymentId)
    })
}

export const createPaymentService = async(payment:TPaymentInsert):Promise<string> =>{
    await db.insert(paymentsTable).values(payment).returning();
    return "Your Payment has been Created Successfully✅"
}

export const updatePaymentService = async(paymentId:number,payment:TPaymentInsert):Promise<string> =>{
    await db.update(paymentsTable).set(payment).where(eq(paymentsTable.paymentId,paymentId))
    return "Your Payment has been updated Successfully✅"
}

export const deletePaymentService = async(paymentId:number):Promise<string> =>{
    await db.delete(paymentsTable).where(eq(paymentsTable.paymentId,paymentId))
    return "Your Payment has been deleted Successfully✅"
}