import { NextRequest, NextResponse } from "next/server";
import { sendPushMessage, getDefaultUserId } from "@lib/line";
import type { SendMessageRequest, SendMessageResponse } from "@type/line.type";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<SendMessageResponse>> => {
  try {
    const body: SendMessageRequest = await request.json();
    const { message, userId } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const targetUserId = userId || getDefaultUserId();
    const result = await sendPushMessage(targetUserId, message.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send API Error:", error);

    if (error instanceof Error && error.message.includes("not configured")) {
      return NextResponse.json(
        { success: false, error: "LINE API credentials are not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
};
