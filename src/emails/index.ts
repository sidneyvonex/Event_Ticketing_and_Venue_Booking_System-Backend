export { sendBookingAndPaymentConfirmation } from './emailService';
// Email Module - Main Export File
export * from './emailTemplates';
export * from './emailService';

// Re-export the main EmailService class and convenience functions
export { EmailService } from './emailService';
export {
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendAccountVerificationEmail,
  sendEmailVerificationSuccessEmail,
  sendEventReminderEmail,
  sendBookingCancellationEmail,
  sendEventUpdateEmail
} from './emailService';
