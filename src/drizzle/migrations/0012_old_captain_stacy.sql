ALTER TABLE "paymentsTable" ADD COLUMN "phoneNumber" varchar(20);--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD COLUMN "mpesaReceiptNumber" varchar(50);--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD COLUMN "checkoutRequestID" varchar(255);--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD COLUMN "merchantRequestID" varchar(255);--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD COLUMN "productName" varchar(100);--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD COLUMN "transactionType" varchar(50);