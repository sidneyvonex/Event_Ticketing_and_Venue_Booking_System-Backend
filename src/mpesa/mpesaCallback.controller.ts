import { Request, Response } from "express";
import db from "../drizzle/db";
import { paymentsTable, bookingTable } from "../drizzle/schema";
import { getBookingByIdService } from "../Bookings/booking.service";
import { getUserByIdServices } from "../User/user.service";
import { getEventByIdService } from "../Event/event.service";
import { sendBookingAndPaymentConfirmation } from "../emails";
import { getVenueByIdService } from "../Venue/venue.service";
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
    let transactionId = "";
    let phoneNumber = "";
    let amount = "";
    let bookingId: number | undefined = undefined;

    if (CallbackMetadata?.Item?.length) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") transactionId = item.Value;
        if (item.Name === "PhoneNumber") phoneNumber = String(item.Value);
        if (item.Name === "Amount") amount = String(item.Value);
      }
    }

    // Update the payment record and get the bookingId
    const [payment] = await db
      .update(paymentsTable)
      .set({
        paymentStatus: transactionStatus,
        transactionId,
        phoneNumber,
        amount
      })
      .where(eq(paymentsTable.checkoutRequestID, CheckoutRequestID))
      .returning();

    if (payment && payment.bookingId) {
      bookingId = payment.bookingId;
    }


    // If payment is completed, update booking status to Confirmed and send email
    if (transactionStatus === "Completed" && bookingId) {
      await db.update(bookingTable)
        .set({ bookingStatus: "Confirmed" })
        .where(eq(bookingTable.bookingId, bookingId));

      // Fetch booking, user, and event details
      const booking = await getBookingByIdService(bookingId);
      if (booking) {
        const user = await getUserByIdServices(booking.userId);
        const event = await getEventByIdService(booking.eventId);
        let venueName = '';
        if (event && event.venueId) {
          const venue = await getVenueByIdService(event.venueId);
          if (venue && venue.venueName) {
            venueName = venue.venueName;
          }
        }
        // Ensure totalAmount is a number
        let totalAmount: number = 0;
        if (typeof booking.totalAmount === 'string') {
          totalAmount = parseFloat(booking.totalAmount);
        } else if (typeof booking.totalAmount === 'number') {
          totalAmount = booking.totalAmount;
        }
        if (user && event) {
          await sendBookingAndPaymentConfirmation(
            {
              recipientEmail: user.email,
              recipientName: user.firstName,
              role: 'user',
            },
            {
              eventTitle: event.eventTitle,
              venueName,
              eventDate: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '',
              eventTime: event.eventTime || '',
              quantity: booking.quantity,
              totalAmount,
              bookingId: booking.bookingId,
              paymentMethod: payment.paymentMethod ? payment.paymentMethod : 'M-Pesa',
              transactionId: payment.transactionId || '',
            }
          );
        }
      }
    }

    res.json({ success: true, status: transactionStatus });
  } catch (error: any) {
    console.error("Callback error:", error);
    res.status(500).json({ error: "Callback failed" });
  }
};
