import { NextRequest, NextResponse } from "next/server";
import { getMessagesSince, getAllMessages } from "@lib/messageStore";

/**
 * Get messages from LINE (received via webhook)
 * Used by the frontend to poll for new messages
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sinceParam = searchParams.get("since");

    let messages;
    if (sinceParam) {
      const since = Number.parseInt(sinceParam, 10);
      messages = getMessagesSince(since);
    } else {
      messages = getAllMessages();
    }

    return NextResponse.json({
      success: true,
      messages,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get messages", messages: [] },
      { status: 500 }
    );
  }
}
