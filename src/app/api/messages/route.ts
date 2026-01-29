import { NextRequest, NextResponse } from "next/server";
import { getMessagesSince, getAllMessages } from "@lib/messageStore";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const sinceParam = searchParams.get("since");

    const messages = sinceParam
      ? getMessagesSince(Number.parseInt(sinceParam, 10))
      : getAllMessages();

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
};
