import { Twilio } from "twilio";
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);

export const sendOTP = async (to: string, otp: string) => {
  const message = await client.messages.create({
    body: `Hello Ride-Share user,Your OTP is: ${otp}`,
    from: twilioNumber,
    to,
  });

  return true;
};
