"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
// src/config/smsSender.ts
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;
const client = (0, twilio_1.default)(accountSid, authToken);
/**
 * Send an SMS to a specific number.
 * @param toPhone - Receiver's phone number (E.164 format, e.g., +2507xxxxxxx)
 * @param message - SMS content
 */
const sendSMS = async (toPhone, message) => {
    try {
        const res = await client.messages.create({
            body: message,
            from: fromPhone,
            to: toPhone,
        });
        console.log(`📤 SMS sent to ${toPhone} (SID: ${res.sid})`);
    }
    catch (error) {
        console.error("❌ Failed to send SMS:", error);
    }
};
exports.sendSMS = sendSMS;
