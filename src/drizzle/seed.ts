// This script seeds the database with initial data for the Tables.
import db from "./db";

import { userTable,venueTable,eventTable,bookingTable,paymentsTable,supportTicketTable } from "./schema";

async function seed() {
    //USERS

    const insertedUsers = await db.insert(userTable).values([
        {
            firstName: "Sidney",
            lastName: "Ndungu",
            email: "sidneygithu@gmail.com",
            password: "hashedpassword1",
            contactPhone: "0798696008",
            address: "102 Githuguri",
            userRole: "user",
          },
          {
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            password: "hashedpassword2",
            contactPhone: "0798765432",
            address: "456 River Road",
            userRole: "admin",
          }
    ]).returning();
    //VENUES
        const insertedVenues = await db.insert(venueTable).values([
            {
            venueName: "Nairobi Convention Center",
            venueAddress: "Kenyatta Ave, Nairobi",
            venueCapacity: 500,
            },
            {
            venueName: "Mombasa Beach Hall",
            venueAddress: "Coastline Rd, Mombasa",
            venueCapacity: 300,
            },
        ]).returning();

        const insertedEvents = await db.insert(eventTable).values([
            {
            eventTitle: "Tech Summit 2025",
            description: "A gathering of tech enthusiasts and professionals.",
            venueId: insertedVenues[0].venueId,
            category: "Technology",
            eventDate: new Date("2025-08-10T10:00:00Z"),
            eventTime: "10:00:00",
            ticketPrice: "1000.00",
            ticketsTotal: 300,
            },
            {
            eventTitle: "Music Festival",
            description: "Live performances from top artists.",
            venueId: insertedVenues[1].venueId,
            category: "Entertainment",
            eventDate: new Date("2025-09-15T15:00:00Z"),
            eventTime: "15:00:00",
            ticketPrice: "1500.00",
            ticketsTotal: 400,
            },
        ]).returning();

        //BOOKINGS

            const insertedBookings = await db.insert(bookingTable).values([
                {
                userId: insertedUsers[0].userId,
                eventId: insertedEvents[0].eventId,
                quantity: 2,
                totalAmount: "2000.00",
                bookingStatus: "Confirmed",
                },
                {
                userId: insertedUsers[1].userId,
                eventId: insertedEvents[1].eventId,
                quantity: 3,
                totalAmount: "4500.00",
                bookingStatus: "Pending",
                },
            ]).returning();

            //PAYMENTS
            const insertedPayments = await db.insert(paymentsTable).values([
                {
                bookingId: insertedBookings[0].bookingId,
                paymentMethod: "Credit Card",
                amount: "2000.00",
                paymentStatus: "Completed",
                transactionId: "TX12345A",
                },
                {
                bookingId: insertedBookings[1].bookingId,
                paymentMethod: "PayPal",
                amount: "4500.00",
                paymentStatus: "Pending",
                transactionId: "TX67890B",
                },
            ]).returning();

            //SUPPORT TICKETS
                await db.insert(supportTicketTable).values([
                    {
                    userId: insertedUsers[0].userId,
                    subject: "Can't download ticket",
                    description: "I booked but can't find my ticket.",
                    supportTicketStatus: "Open",
                    },
                    {
                    userId: insertedUsers[1].userId,
                    subject: "Event date confusion",
                    description: "The date on the email is different from the site.",
                    supportTicketStatus: "In Progress",
                    },
                ]);

                console.log("✅ Database seeded successfully");
                process.exit(0);

}
seed().catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  });