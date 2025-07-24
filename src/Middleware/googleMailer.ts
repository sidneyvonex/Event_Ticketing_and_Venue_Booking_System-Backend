// Sending Mail Logic using the Nodemailer
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type UserRole = 'user' | 'admin';
export type EmailType = 'booking_confirmation' | 'event_notification' | 'payment_confirmation' | 'account_verification' | 'password_reset';

export const sendEventEmail = async (
  recipientEmail: string,
  recipientName: string,
  subject: string,
  messageHtml: string,
  role: UserRole,
  emailType: EmailType,
  heading?: string
): Promise<string> => {
  try {
    const defaultHeadingMap: Record<EmailType, string> = {
      booking_confirmation: 'TicKenya - Booking Confirmation',
      event_notification: 'TicKenya - Event Update',
      payment_confirmation: 'TicKenya - Payment Confirmation',
      account_verification: 'TicKenya - Account Verification',
      password_reset: 'TicKenya - Password Reset',
    };

    const emailHeading = heading ?? defaultHeadingMap[emailType] ?? 'TicKenya - Event Ticketing System';

    const mailOptions = {
      from: `"TicKenya - Event Ticketing System" <${process.env.EMAIL_SENDER}>`,
      to: recipientEmail,
      subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f6f9;
              margin: 0;
              padding: 0;
              line-height: 1.6;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
              color: #333;
              border-top: 5px solid #6366f1;
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #6366f1;
              font-size: 28px;
              margin: 0;
              font-weight: bold;
            }
            h2 {
              color: #6366f1;
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
            }
            .greeting {
              font-size: 18px;
              color: #374151;
              margin-bottom: 20px;
            }
            .content {
              background-color: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #6366f1;
            }
            .footer {
              font-size: 14px;
              color: #6b7280;
              margin-top: 30px;
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .btn {
              display: inline-block;
              background-color: #6366f1;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 15px 0;
            }
            .social-links {
              text-align: center;
              margin-top: 20px;
            }
            .social-links a {
              color: #6366f1;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="logo">
              <h1>TicKenya</h1>
            </div>
            
            <h2>${emailHeading}</h2>
            
            <div class="greeting">
              Hello ${recipientName},
            </div>
            
            <div class="content">
              ${messageHtml}
            </div>
            
            <p style="margin-top: 25px; color: #374151;">
              Thank you for choosing EventTix for your event booking needs. We're committed to providing you with the best ticketing experience.
            </p>
            
            <div class="social-links">
              <a href="#" style="color: #6366f1;">📧 Support</a>
              <a href="#" style="color: #6366f1;">🌐 Website</a>
              <a href="#" style="color: #6366f1;">📱 Mobile App</a>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EventTix - Event Ticketing & Venue Booking System. All rights reserved.</p>
              <p>This email was sent to ${recipientEmail}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log(`[sendEventEmail] Sending ${emailType} email to ${recipientEmail} with subject "${subject}"`);

    const result = await transporter.sendMail(mailOptions);

    if (result.accepted.length > 0) {
      console.log(`[sendEventEmail] Email sent successfully to ${recipientEmail}`);
      return 'Email sent successfully from TicKenya';
    } else if (result.rejected.length > 0) {
      console.warn(`[sendEventEmail] Email was rejected by the server for ${recipientEmail}`);
      return 'Email was rejected by the server';
    } else {
      console.warn(`[sendEventEmail] Unknown email delivery status for ${recipientEmail}`);
      return 'Unknown email delivery status';
    }
  } catch (error) {
    console.error('[sendEventEmail] Email sending error:', error);
    return 'Email sending failed due to server error';
  }
};

// Helper functions for specific email types
export const sendBookingConfirmation = async (
  recipientEmail: string,
  recipientName: string,
  eventTitle: string,
  venueName: string,
  eventDate: string,
  eventTime: string,
  quantity: number,
  totalAmount: number,
  bookingId: number
): Promise<string> => {
  const messageHtml = `
    <h3>🎉 Your booking has been confirmed!</h3>
    <p><strong>Event:</strong> ${eventTitle}</p>
    <p><strong>Venue:</strong> ${venueName}</p>
    <p><strong>Date:</strong> ${eventDate}</p>
    <p><strong>Time:</strong> ${eventTime}</p>
    <p><strong>Tickets:</strong> ${quantity}</p>
    <p><strong>Total Amount:</strong> $${totalAmount}</p>
    <p><strong>Booking ID:</strong> #${bookingId}</p>
    <hr>
    <p>Please save this email as your booking confirmation. Present your booking ID at the venue entrance.</p>
  `;

  return await sendEventEmail(
    recipientEmail,
    recipientName,
    `Booking Confirmation for ${eventTitle}`,
    messageHtml,
    'user',
    'booking_confirmation'
  );
};

export const sendPaymentConfirmation = async (
  recipientEmail: string,
  recipientName: string,
  amount: number,
  paymentMethod: string,
  transactionId: string,
  eventTitle: string
): Promise<string> => {
  const messageHtml = `
    <h3>💳 Payment Confirmed</h3>
    <p>Your payment for <strong>${eventTitle}</strong> has been successfully processed.</p>
    <p><strong>Amount Paid:</strong> $${amount}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
    <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
    <hr>
    <p>Your tickets are now confirmed and ready for use!</p>
  `;

  return await sendEventEmail(
    recipientEmail,
    recipientName,
    `Payment Confirmation - ${eventTitle}`,
    messageHtml,
    'user',
    'payment_confirmation'
  );
};

export const sendPasswordResetEmail = async (
  recipientEmail: string,
  recipientName: string,
  resetToken: string,
  resetUrl: string
): Promise<string> => {
  const messageHtml = `
    <h3>🔒 Password Reset Request</h3>
    <p>We received a request to reset your password for your EventTix account.</p>
    <p>Click the button below to reset your password:</p>
    <a href="${resetUrl}" class="btn" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0;">Reset Password</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${resetUrl}</p>
    <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
    <hr>
    <p>If you didn't request this password reset, please ignore this email or contact our support team.</p>
  `;

  return await sendEventEmail(
    recipientEmail,
    recipientName,
    'Reset Your EventTix Password',
    messageHtml,
    'user',
    'password_reset'
  );
};

export const sendAccountVerification = async (
  recipientEmail: string,
  recipientName: string,
  verificationUrl: string
): Promise<string> => {
  const messageHtml = `
    <h3>✅ Welcome to EventTix!</h3>
    <p>Thank you for creating an account with EventTix. To complete your registration, please verify your email address.</p>
    <a href="${verificationUrl}" class="btn" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0;">Verify Email Address</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
    <hr>
    <p>Once verified, you'll be able to:</p>
    <ul>
      <li>Browse and book tickets for events</li>
      <li>Manage your bookings</li>
      <li>Receive event notifications</li>
      <li>Access exclusive member offers</li>
    </ul>
  `;

  return await sendEventEmail(
    recipientEmail,
    recipientName,
    'Verify Your EventTix Account',
    messageHtml,
    'user',
    'account_verification'
  );
};