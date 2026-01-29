import { NextResponse } from "next/server";
import { getAllMessages } from "@lib/messageStore";

export const GET = async (): Promise<NextResponse> => {
  try {
    const messages = getAllMessages();

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
