import {Router } from "express"
import {createPayment,updatePayment,deletePayment,getAllPayments,getPaymentById, getPaymentsByUserId, getPaymentStatusByCheckoutRequestID} from "./payments.controller"
// Payment status polling route for frontend



export const paymentRouter = Router();
/**
 * @Swagger
 */

paymentRouter.get('/payments',getAllPayments);

paymentRouter.get('/payments/user',getPaymentsByUserId)

paymentRouter.get('/payments/:id',getPaymentById);

paymentRouter.post('/payments',createPayment);

paymentRouter.put('/payments/:id',updatePayment);

paymentRouter.delete('/payments/:id',deletePayment);

paymentRouter.get('/payment-status', getPaymentStatusByCheckoutRequestID);
