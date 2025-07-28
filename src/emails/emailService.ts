// Send Booking & Payment Confirmation Email (with download ticket message)
export async function sendBookingAndPaymentConfirmation(
  emailData: EmailData,
  details: {
    eventTitle: string;
    venueName: string;
    eventDate: string;
    eventTime: string;
    quantity: number;
    totalAmount: number;
    bookingId: number;
    paymentMethod: string;
    transactionId: string;
  }
): Promise<string> {
  const template = EmailTemplates.getBookingAndPaymentEmail(
    emailData.recipientName,
    emailData.recipientEmail,
    details.eventTitle,
    details.venueName,
    details.eventDate,
    details.eventTime,
    details.quantity,
    details.totalAmount,
    details.bookingId,
    details.paymentMethod,
    details.transactionId
  );
  return await sendEventEmail(
    emailData.recipientEmail,
    emailData.recipientName,
    template.subject,
    template.body,
    emailData.role || 'user',
    'booking_confirmation' // Use a valid EmailType
  );
}
  // ...existing code...
// Email Service - Dynamic Email Sending with Templates
import { sendEventEmail, EmailType } from '../Middleware/googleMailer';
import * as EmailTemplates from './emailTemplates';

export interface EmailData {
  recipientEmail: string;
  recipientName: string;
  role?: 'user' | 'admin';
}

export class EmailService {
  // Send Welcome Email
  static async sendWelcomeEmail(emailData: EmailData): Promise<string> {
    const template = EmailTemplates.getUserWelcomeEmail(emailData.recipientName);
    
    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'account_verification'
    );
  }

  // Send Booking Confirmation Email
  static async sendBookingConfirmation(
    emailData: EmailData,
    bookingDetails: {
      eventTitle: string;
      venueName: string;
      eventDate: string;
      eventTime: string;
      quantity: number;
      totalAmount: number;
      bookingId: number;
    }
  ): Promise<string> {
    const template = EmailTemplates.getBookingConfirmationEmail(
      emailData.recipientName,
      bookingDetails.eventTitle,
      bookingDetails.venueName,
      bookingDetails.eventDate,
      bookingDetails.eventTime,
      bookingDetails.quantity,
      bookingDetails.totalAmount,
      bookingDetails.bookingId
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'booking_confirmation'
    );
  }

  // Send Payment Confirmation Email
  static async sendPaymentConfirmation(
    emailData: EmailData,
    paymentDetails: {
      eventTitle: string;
      amount: number;
      paymentMethod: string;
      transactionId: string;
    }
  ): Promise<string> {
    const template = EmailTemplates.getPaymentConfirmationEmail(
      emailData.recipientName,
      paymentDetails.eventTitle,
      paymentDetails.amount,
      paymentDetails.paymentMethod,
      paymentDetails.transactionId
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'payment_confirmation'
    );
  }

  // Send Password Reset Email
  static async sendPasswordReset(
    emailData: EmailData,
    resetUrl: string
  ): Promise<string> {
    const template = EmailTemplates.getPasswordResetEmail(
      emailData.recipientName,
      resetUrl
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'password_reset'
    );
  }

  // Send Password Reset Success Confirmation Email
  static async sendPasswordResetSuccess(
    emailData: EmailData
  ): Promise<string> {
    const template = EmailTemplates.getPasswordResetSuccessEmail(
      emailData.recipientName
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'password_reset'
    );
  }

  // Send Email Verification Success Confirmation Email
  static async sendEmailVerificationSuccess(
    emailData: EmailData
  ): Promise<string> {
    const template = EmailTemplates.getEmailVerificationSuccessEmail(
      emailData.recipientName
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'account_verification'
    );
  }

  // Send Account Verification Email
  static async sendAccountVerification(
    emailData: EmailData,
    verificationUrl: string
  ): Promise<string> {
    const template = EmailTemplates.getAccountVerificationEmail(
      emailData.recipientName,
      verificationUrl
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'account_verification'
    );
  }

  // Send Event Reminder Email
  static async sendEventReminder(
    emailData: EmailData,
    eventDetails: {
      eventTitle: string;
      venueName: string;
      eventDate: string;
      eventTime: string;
      bookingId: number;
    }
  ): Promise<string> {
    const template = EmailTemplates.getEventReminderEmail(
      emailData.recipientName,
      eventDetails.eventTitle,
      eventDetails.venueName,
      eventDetails.eventDate,
      eventDetails.eventTime,
      eventDetails.bookingId
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'event_notification'
    );
  }

  // Send Booking Cancellation Email
  static async sendBookingCancellation(
    emailData: EmailData,
    cancellationDetails: {
      eventTitle: string;
      bookingId: number;
      refundAmount?: number;
    }
  ): Promise<string> {
    const template = EmailTemplates.getBookingCancellationEmail(
      emailData.recipientName,
      cancellationDetails.eventTitle,
      cancellationDetails.bookingId,
      cancellationDetails.refundAmount
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'event_notification'
    );
  }

  // Send Event Update Email
  static async sendEventUpdate(
    emailData: EmailData,
    updateDetails: {
      eventTitle: string;
      updateType: 'venue_change' | 'time_change' | 'date_change' | 'general_update';
      updateDetails: string;
      bookingId: number;
    }
  ): Promise<string> {
    const template = EmailTemplates.getEventUpdateEmail(
      emailData.recipientName,
      updateDetails.eventTitle,
      updateDetails.updateType,
      updateDetails.updateDetails,
      updateDetails.bookingId
    );

    return await sendEventEmail(
      emailData.recipientEmail,
      emailData.recipientName,
      template.subject,
      template.body,
      emailData.role || 'user',
      'event_notification'
    );
  }
}

// Convenience functions for quick access
export const sendWelcomeEmail = EmailService.sendWelcomeEmail;
export const sendBookingConfirmationEmail = EmailService.sendBookingConfirmation;
export const sendPaymentConfirmationEmail = EmailService.sendPaymentConfirmation;
export const sendPasswordResetEmail = EmailService.sendPasswordReset;
export const sendPasswordResetSuccessEmail = EmailService.sendPasswordResetSuccess;
export const sendAccountVerificationEmail = EmailService.sendAccountVerification;
export const sendEmailVerificationSuccessEmail = EmailService.sendEmailVerificationSuccess;
export const sendEventReminderEmail = EmailService.sendEventReminder;
export const sendBookingCancellationEmail = EmailService.sendBookingCancellation;
export const sendEventUpdateEmail = EmailService.sendEventUpdate;
