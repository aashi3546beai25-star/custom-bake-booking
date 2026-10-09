/**
 * 🔔 Automated Notifications Configuration
 * Configure Email & SMS delivery credentials for automated customer & owner messages.
 */

import { EMAIL, PHONE } from "@/contact";

export const NOTIFICATIONS_CONFIG = {
  // Bakery Owner details (Sender)
  senderEmail: EMAIL, // "sweetcrumbbakery@gmail.com"
  senderName: "Sweet Crumb Bakery",
  senderPhone: PHONE, // "(555) 234-5678"

  // 1. Email Service Integration (Resend / EmailJS / Formspree)
  // Get a free API key from https://resend.com or https://www.emailjs.com
  resendApiKey: "", 
  emailJs: {
    serviceId: "",
    templateId: "",
    publicKey: "",
  },
  
  // 2. Formspree Backup Email Hook (https://formspree.io)
  formspreeId: "",

  // 3. SMS / WhatsApp Service Integration (Twilio / Webhook)
  // Get credentials from https://twilio.com
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhoneNumber: "",
  },

  // Enable/disable automated background sending simulation when keys are empty
  enableAutoDispatch: true,
};
