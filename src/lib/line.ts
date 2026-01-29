import axios, { AxiosInstance, AxiosError } from "axios";
import crypto from "node:crypto";
import {
  getLineConfig,
  getChannelSecret,
  getDefaultUserId as getDefaultUserIdFromConfig,
} from "@/config/line.config";

/**
 * Create axios instance for LINE API
 */
const createLineClient = (): AxiosInstance => {
  const config = getLineConfig();

  return axios.create({
    baseURL: config.apiBase,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.channelAccessToken}`,
    },
    timeout: config.timeout,
  });
};

/**
 * Get default LINE User ID from environment
 */
export const getDefaultUserId = (): string => getDefaultUserIdFromConfig();

/**
 * Send a push message to a specific LINE user
 */
export const sendPushMessage = async (
  userId: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = createLineClient();
    await client.post("/message/push", {
      to: userId,
      messages: [{ type: "text", text: message }],
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send LINE message:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        success: false,
        error: axiosError.response?.data?.message || axiosError.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Verify LINE webhook signature
 */
export const verifySignature = (body: string, signature: string): boolean => {
  try {
    const channelSecret = getChannelSecret();
    const hash = crypto
      .createHmac("SHA256", channelSecret)
      .update(body)
      .digest("base64");
    return hash === signature;
  } catch {
    return false;
  }
};

/**
 * Send a reply message (used in webhook responses)
 */
export const sendReplyMessage = async (
  replyToken: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = createLineClient();
    await client.post("/message/reply", {
      replyToken,
      messages: [{ type: "text", text: message }],
    });
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        success: false,
        error: axiosError.response?.data?.message || axiosError.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
