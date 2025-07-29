
import { Request, Response } from "express";
import { getAccessToken } from "../mpesa/mpesaAuth";
import { stkPush } from "../mpesa/mpesaStkPush";
import db from "../drizzle/db";
import { bookingTable, eventTable, paymentsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const bookAndPayMpesa = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse and validate input types
    let { userId, eventId, quantity, phoneNumber } = req.body;
    const missingFields = [];
    if (userId === undefined || userId === null || userId === "") missingFields.push('userId');
    if (eventId === undefined || eventId === null || eventId === "") missingFields.push('eventId');
    if (quantity === undefined || quantity === null || quantity === "") missingFields.push('quantity');
    if (!phoneNumber) missingFields.push('phoneNumber');
    if (missingFields.length > 0) {
      res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}`, received: req.body });
      return;
    }

    // Convert to numbers if needed
    userId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    eventId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    quantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

    if (isNaN(userId) || isNaN(eventId) || isNaN(quantity)) {
      res.status(400).json({ error: "userId, eventId, and quantity must be valid numbers", received: req.body });
      return;
    }

    // Phone number validation
    if (typeof phoneNumber !== 'string' || !/^254\d{9}$/.test(phoneNumber)) {
      res.status(400).json({ error: "Phone number must start with 254 and be 12 digits long", received: phoneNumber });
      return;
    }

    // 1. Get event details
    const event = await db.query.eventTable.findFirst({
      where: eq(eventTable.eventId, eventId),
    });

    if (!event) {
      res.status(404).json({ error: "Event not found", eventId });
      return;
    }

    const amount = Number(event.ticketPrice) * Number(quantity);
    const productName = event.eventTitle;

    // 2. Create booking (status: Pending)
    const bookingArr = await db.insert(bookingTable).values({
      userId,
      eventId,
      quantity,
      totalAmount: amount.toString(),
      bookingStatus: "Pending",
    }).returning();
    const booking = bookingArr && bookingArr[0];
    if (!booking) {
      res.status(500).json({ error: "Failed to create booking" });
      return;
    }

    // 3. Initiate M-Pesa STK Push
    const accessToken = await getAccessToken();
    const initiateStkResponse = await stkPush(accessToken, phoneNumber, amount, productName);
    const checkoutRequestID = initiateStkResponse?.CheckoutRequestID;
    if (!checkoutRequestID) {
      res.status(400).json({ error: "Failed to initiate M-Pesa payment", stkResponse: initiateStkResponse });
      return;
    }

    // 4. Store payment in paymentsTable (status: Pending)
    await db.insert(paymentsTable).values({
      bookingId: booking.bookingId,
      amount: amount.toString(),
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
    // In production, avoid exposing stack traces
    res.status(500).json({ error: error.message || "Booking and payment failed" });
  }
};

