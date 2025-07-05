// src/config/smsSender.ts
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

/**
 * Send an SMS to a specific number.
 * @param toPhone - Receiver's phone number (E.164 format, e.g., +2507xxxxxxx)
 * @param message - SMS content
 */
export const sendSMS = async (toPhone: string, message: string): Promise<void> => {
    try {
        const res = await client.messages.create({
            body: message,
            from: fromPhone,
            to: toPhone,
        });

        console.log(`📤 SMS sent to ${toPhone} (SID: ${res.sid})`);
    } catch (error) {
        console.error("❌ Failed to send SMS:", error);
    }
};
