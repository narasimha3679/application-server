import { redisClient } from "../../src/data-source";

export async function setOtp(userId: string, otp: string) {
  const key = `otp:${userId}`;
  // Set the OTP in Redis to expire after 10 minutes
  await redisClient.set(key, otp, "EX", 60 * 10);
}

export async function getOtp(userId: string) {
  const key = `otp:${userId}`;
  // Get the OTP from Redis
  const otp = await redisClient.get(key);
  return otp;
}
