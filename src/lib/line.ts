import { AxiosError } from "axios";
import crypto from "node:crypto";
import {
  getChannelSecret,
  getDefaultUserId as getDefaultUserIdFromConfig,
} from "@config/line.config";
import { createLineApiClient, isAxiosError } from "@lib/axios";

export const getDefaultUserId = (): string => getDefaultUserIdFromConfig();

export const sendPushMessage = async (
  userId: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = createLineApiClient();
    await client.post("/message/push", {
      to: userId,
      messages: [{ type: "text", text: message }],
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send LINE message:", error);

    if (isAxiosError(error)) {
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

export const sendReplyMessage = async (
  replyToken: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = createLineApiClient();
    await client.post("/message/reply", {
      replyToken,
      messages: [{ type: "text", text: message }],
    });
    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
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
