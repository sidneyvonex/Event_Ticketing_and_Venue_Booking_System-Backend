import { Request, Response } from "express";
import db from "../drizzle/db";
import { paymentsTable, bookingTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const mpesaCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📥 M-Pesa Callback:", JSON.stringify(req.body, null, 2));
    const stkCallback = req.body?.Body?.stkCallback;
    if (!stkCallback) {
      res.status(400).json({ error: "Missing stkCallback in body" });
      return;
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;
    if (!CheckoutRequestID) {
      res.status(400).json({ error: "Missing CheckoutRequestID" });
      return;
    }

    const transactionStatus = ResultCode === 0 ? "Completed" : "Failed";
    let mpesaReceiptNumber = "";
    let phoneNumber = "";
    let amount = "";
    let bookingId: number | undefined = undefined;

    if (CallbackMetadata?.Item?.length) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = item.Value;
        if (item.Name === "PhoneNumber") phoneNumber = String(item.Value);
        if (item.Name === "Amount") amount = String(item.Value);
      }
    }

    // Update the payment record and get the bookingId
    const [payment] = await db
      .update(paymentsTable)
      .set({
        paymentStatus: transactionStatus,
        mpesaReceiptNumber,
        phoneNumber,
        amount
      })
      .where(eq(paymentsTable.checkoutRequestID, CheckoutRequestID))
      .returning();

    if (payment && payment.bookingId) {
      bookingId = payment.bookingId;
    }

    // If payment is completed, update booking status to Confirmed
    if (transactionStatus === "Completed" && bookingId) {
      await db.update(bookingTable)
        .set({ bookingStatus: "Confirmed" })
        .where(eq(bookingTable.bookingId, bookingId));
    }

    res.json({ success: true, status: transactionStatus });
  } catch (error: any) {
    console.error("Callback error:", error);
    res.status(500).json({ error: "Callback failed" });
  }
};
