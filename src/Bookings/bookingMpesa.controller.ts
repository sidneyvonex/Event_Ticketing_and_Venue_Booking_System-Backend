
import { Request, Response } from "express";
import { getAccessToken } from "../mpesa/mpesaAuth";
import { stkPush } from "../mpesa/mpesaStkPush";
import db from "../drizzle/db";
import { bookingTable, eventTable, paymentsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const bookAndPayMpesa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventId, quantity, phoneNumber } = req.body;

    // Input validations
    if (!userId || !eventId || !quantity || !phoneNumber) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    if (!phoneNumber.startsWith("254")) {
      res.status(400).json({ error: "Phone number must start with 254" });
      return;
    }

    // 1. Get event details
    const event = await db.query.eventTable.findFirst({
      where: eq(eventTable.eventId, eventId),
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const amount = Number(event.ticketPrice) * Number(quantity);
    const productName = event.eventTitle;

    // 2. Create booking (status: Pending)
    // After payment is completed (via callback), booking status will be updated to 'Confirmed' automatically.
    const [booking] = await db.insert(bookingTable).values({
      userId,
      eventId,
      quantity,
      totalAmount: amount.toString(),
      bookingStatus: "Pending",
    }).returning();

    // 3. Initiate M-Pesa STK Push
    const accessToken = await getAccessToken();
    const initiateStkResponse = await stkPush(accessToken, phoneNumber, amount, productName);
    const checkoutRequestID = initiateStkResponse?.CheckoutRequestID;
    if (!checkoutRequestID) {
      res.status(400).json({ error: "Failed to initiate M-Pesa payment" });
      return;
    }

    // 4. Store payment in paymentsTable (status: Pending)
    await db.insert(paymentsTable).values({
      bookingId: booking.bookingId,
      amount:amount.toString(),
      paymentStatus: "Pending",
      paymentMethod: "Mpesa",
      phoneNumber,
      productName,
      checkoutRequestID,
      transactionType: "CustomerPayBillOnline",
    });

    res.json({
      success: true,
      message: "Booking created and M-Pesa payment initiated. Complete payment on your phone.",
      bookingId: booking.bookingId,
      checkoutRequestID,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Booking and payment failed" });
  }
};

