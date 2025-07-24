// Email Templates for TicKenya Event Ticketing System

export interface EmailTemplate {
  subject: string;
  body: string;
}

// User Welcome Email
export const getUserWelcomeEmail = (name: string): EmailTemplate => {
  return {
    subject: "Welcome to 🎟️ TicKenya!",
    body: `
      <p>Dear ${name},</p>
      <p>Welcome to TicKenya - your premier destination for event tickets and venue bookings!</p>
      <p>You can now:</p>
      <ul>
        <li>Browse and book tickets for amazing events</li>
        <li>Manage your bookings and view event details</li>
        <li>Access your digital tickets instantly</li>
        <li>Receive notifications about upcoming events</li>
        <li>Enjoy exclusive member discounts</li>
      </ul>
      <p>We're excited to help you discover incredible events and create unforgettable memories!</p>
      <p>Happy booking! 🎉</p>
    `,
  };
};

// Booking Confirmation Email
export const getBookingConfirmationEmail = (
  name: string,
  eventTitle: string,
  venueName: string,
  eventDate: string,
  eventTime: string,
  quantity: number,
  totalAmount: number,
  bookingId: number
): EmailTemplate => {
  return {
    subject: `Booking Confirmed: ${eventTitle}`,
    body: `
      <p>Dear ${name},</p>
      <h3>🎉 Your booking has been confirmed!</h3>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #6366f1; margin-top: 0;">Event Details:</h4>
        <p><strong>Event:</strong> ${eventTitle}</p>
        <p><strong>Venue:</strong> ${venueName}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
        <p><strong>Tickets:</strong> ${quantity}</p>
        <p><strong>Total Amount:</strong> KSh ${totalAmount}</p>
        <p><strong>Booking ID:</strong> #${bookingId}</p>
      </div>
      <p><strong>Important:</strong> Please save this email as your booking confirmation. Present your booking ID at the venue entrance.</p>
      <p>We can't wait to see you at the event! 🎊</p>
    `,
  };
};

// Payment Confirmation Email
export const getPaymentConfirmationEmail = (
  name: string,
  eventTitle: string,
  amount: number,
  paymentMethod: string,
  transactionId: string
): EmailTemplate => {
  return {
    subject: `💳 Payment Confirmed: ${eventTitle}`,
    body: `
      <p>Dear ${name},</p>
      <h3>💳 Payment Successfully Processed</h3>
      <p>Your payment for <strong>${eventTitle}</strong> has been successfully processed.</p>
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
        <h4 style="color: #0ea5e9; margin-top: 0;">Payment Details:</h4>
        <p><strong>💰 Amount Paid:</strong> KSh ${amount}</p>
        <p><strong>💳 Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>🆔 Transaction ID:</strong> ${transactionId}</p>
        <p><strong>📅 Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>Your tickets are now confirmed and ready for use! 🎫</p>
      <p>Thank you for using TicKenya! 🙏</p>
    `,
  };
};

// Password Reset Email
export const getPasswordResetEmail = (
  name: string,
  resetUrl: string
): EmailTemplate => {
  return {
    subject: "🔒 Reset Your TicKenya Password",
    body: `
      <p>Dear ${name},</p>
      <h3>🔒 Password Reset Request</h3>
      <p>We received a request to reset your password for your TicKenya account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: #f3f4f6; padding: 15px; border-radius: 6px; font-family: monospace;">${resetUrl}</p>
      <p><strong>⚠️ This link will expire in 1 hour for security reasons.</strong></p>
      <p>If you didn't request this password reset, please ignore this email or contact our support team.</p>
    `,
  };
};

// Account Verification Email
export const getAccountVerificationEmail = (
  name: string,
  verificationUrl: string
): EmailTemplate => {
  return {
    subject: "✅ Verify Your TicKenya Account",
    body: `
      <p>Dear ${name},</p>
      <h3>✅ Welcome to TicKenya!</h3>
      <p>Thank you for creating an account with TicKenya. To complete your registration, please verify your email address.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: #f3f4f6; padding: 15px; border-radius: 6px; font-family: monospace;">${verificationUrl}</p>
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h4 style="color: #059669; margin-top: 0;">Once verified, you'll be able to:</h4>
        <ul style="color: #065f46;">
          <li>🎪 Browse and book tickets for events</li>
          <li>📋 Manage your bookings and view history</li>
          <li>🔔 Receive event notifications and updates</li>
          <li>🎁 Access exclusive member offers and discounts</li>
          <li>⭐ Rate and review events you've attended</li>
        </ul>
      </div>
      <p>We're excited to have you join the TicKenya community! 🚀</p>
    `,
  };
};

// Event Reminder Email
export const getEventReminderEmail = (
  name: string,
  eventTitle: string,
  venueName: string,
  eventDate: string,
  eventTime: string,
  bookingId: number
): EmailTemplate => {
  return {
    subject: `⏰ Reminder: ${eventTitle} - Tomorrow!`,
    body: `
      <p>Dear ${name},</p>
      <h3>⏰ Don't Forget - Your Event is Tomorrow!</h3>
      <p>This is a friendly reminder that you have an upcoming event:</p>
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h4 style="color: #d97706; margin-top: 0;">Event Details:</h4>
        <p><strong>🎪 Event:</strong> ${eventTitle}</p>
        <p><strong>📍 Venue:</strong> ${venueName}</p>
        <p><strong>📅 Date:</strong> ${eventDate}</p>
        <p><strong>⏰ Time:</strong> ${eventTime}</p>
        <p><strong>🆔 Booking ID:</strong> #${bookingId}</p>
      </div>
      <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #1d4ed8; margin-top: 0;">📝 What to Remember:</h4>
        <ul style="color: #1e40af;">
          <li>📱 Bring your phone with this email or booking confirmation</li>
          <li>🆔 Have your Booking ID ready: #${bookingId}</li>
          <li>⏰ Arrive 30 minutes before the event starts</li>
          <li>🎫 Check-in at the venue entrance with your booking details</li>
        </ul>
      </div>
      <p>We hope you have an amazing time at the event! 🎉</p>
    `,
  };
};

// Booking Cancellation Email
export const getBookingCancellationEmail = (
  name: string,
  eventTitle: string,
  bookingId: number,
  refundAmount?: number
): EmailTemplate => {
  return {
    subject: `❌ Booking Cancelled: ${eventTitle}`,
    body: `
      <p>Dear ${name},</p>
      <h3>❌ Booking Cancellation Confirmed</h3>
      <p>Your booking for <strong>${eventTitle}</strong> has been successfully cancelled.</p>
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <h4 style="color: #dc2626; margin-top: 0;">Cancellation Details:</h4>
        <p><strong>🎪 Event:</strong> ${eventTitle}</p>
        <p><strong>🆔 Booking ID:</strong> #${bookingId}</p>
        <p><strong>📅 Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
        ${refundAmount ? `<p><strong>💰 Refund Amount:</strong> KSh ${refundAmount}</p>` : ''}
      </div>
      ${refundAmount ? 
        `<p><strong>💳 Refund Processing:</strong> Your refund will be processed within 5-7 business days to your original payment method.</p>` : 
        `<p><strong>ℹ️ Note:</strong> This booking was cancelled outside the refund window. No refund will be processed.</p>`
      }
      <p>We're sorry to see you go, but we understand plans can change. We hope to see you at future events!</p>
      <p>Thank you for choosing TicKenya! 🙏</p>
    `,
  };
};

// Event Update Notification Email
export const getEventUpdateEmail = (
  name: string,
  eventTitle: string,
  updateType: 'venue_change' | 'time_change' | 'date_change' | 'general_update',
  updateDetails: string,
  bookingId: number
): EmailTemplate => {
  const updateTypeMessages = {
    venue_change: '📍 Venue Change',
    time_change: '⏰ Time Change',
    date_change: '📅 Date Change',
    general_update: '📢 Important Update'
  };

  return {
    subject: `🔄 Update: ${eventTitle} - ${updateTypeMessages[updateType]}`,
    body: `
      <p>Dear ${name},</p>
      <h3>🔄 Important Update About Your Event</h3>
      <p>We have an important update regarding your upcoming event booking:</p>
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h4 style="color: #d97706; margin-top: 0;">${updateTypeMessages[updateType]}</h4>
        <p><strong>🎪 Event:</strong> ${eventTitle}</p>
        <p><strong>🆔 Your Booking ID:</strong> #${bookingId}</p>
      </div>
      <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #1d4ed8; margin-top: 0;">📝 Update Details:</h4>
        <p style="color: #1e40af;">${updateDetails}</p>
      </div>
      <p>If you have any concerns about this update or need to make changes to your booking, please contact our support team.</p>
      <p>Thank you for your understanding! 🙏</p>
    `,
  };
};

// Password Reset Success Confirmation Email
export const getPasswordResetSuccessEmail = (
  name: string
): EmailTemplate => {
  return {
    subject: "✅ Password Reset Successful - TicKenya",
    body: `
      <p>Dear ${name},</p>
      <h3>✅ Password Reset Successful</h3>
      <p>Your password has been successfully reset for your TicKenya account.</p>
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h4 style="color: #059669; margin-top: 0;">🔐 Security Details:</h4>
        <p style="color: #065f46;"><strong>✅ Password Changed:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: #065f46;"><strong>📧 Account Email:</strong> Protected for security</p>
        <p style="color: #065f46;"><strong>🌐 Reset From:</strong> TicKenya Web Platform</p>
      </div>
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h4 style="color: #d97706; margin-top: 0;">🛡️ Security Recommendations:</h4>
        <ul style="color: #92400e;">
          <li>Keep your new password secure and don't share it with anyone</li>
          <li>Use a unique password that you don't use on other websites</li>
          <li>Consider enabling two-factor authentication if available</li>
          <li>Log out of any devices you don't recognize</li>
        </ul>
      </div>
      <p><strong>⚠️ If you didn't make this change:</strong> Please contact our support team immediately, as someone may have unauthorized access to your account.</p>
      <p>You can now log in to your TicKenya account using your new password.</p>
      <p>Thank you for keeping your account secure! 🔒</p>
    `,
  };
};

// Email Verification Success Confirmation Email
export const getEmailVerificationSuccessEmail = (
  name: string
): EmailTemplate => {
  return {
    subject: "🎉 Email Verified Successfully - Welcome to TicKenya!",
    body: `
      <p>Dear ${name},</p>
      <h3>🎉 Email Verification Successful!</h3>
      <p>Congratulations! Your email address has been successfully verified for your TicKenya account.</p>
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h4 style="color: #059669; margin-top: 0;">✅ Account Status:</h4>
        <p style="color: #065f46;"><strong>📧 Email Status:</strong> Verified ✅</p>
        <p style="color: #065f46;"><strong>🕒 Verified On:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: #065f46;"><strong>🎟️ Account Type:</strong> Active TicKenya Member</p>
      </div>
      <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h4 style="color: #1e40af; margin-top: 0;">🚀 What's Next?</h4>
        <p style="color: #1e3a8a;">Now that your email is verified, you can:</p>
        <ul style="color: #1e3a8a;">
          <li>🎪 Browse and book tickets for amazing events</li>
          <li>📋 View and manage your booking history</li>
          <li>🔔 Receive important event notifications and updates</li>
          <li>🎁 Access exclusive member offers and early bird discounts</li>
          <li>⭐ Rate and review events you've attended</li>
          <li>🎫 Get instant access to your digital tickets</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/events" style="background-color: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">🎟️ Start Booking Events</a>
      </div>
      <p>We're thrilled to have you as part of the TicKenya community! Start exploring amazing events and create unforgettable memories.</p>
      <p>Welcome aboard! 🎊</p>
    `,
  };
};
