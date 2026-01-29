import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@lib/line";
import { addMessage } from "@lib/messageStore";
import type { LineWebhookBody, LineWebhookEvent } from "@type/line.type";

/**
 * Handle LINE Webhook events
 * LINE sends events here when users interact with the bot
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();

    // Verify LINE signature
    const signature = request.headers.get("x-line-signature");
    if (!signature) {
      console.error("Missing LINE signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify the signature (skip in development if needed)
    const isValid = verifySignature(rawBody, signature);
    if (!isValid) {
      console.error("Invalid LINE signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook body
    const body: LineWebhookBody = JSON.parse(rawBody);

    // Process each event
    for (const event of body.events) {
      await handleEvent(event);
    }

    // LINE expects a 200 response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    // Still return 200 to prevent LINE from retrying
    return NextResponse.json({ success: true });
  }
}

/**
 * Handle individual webhook events
 */
async function handleEvent(event: LineWebhookEvent): Promise<void> {
  console.log("Received LINE event:", event.type);

  switch (event.type) {
    case "message":
      await handleMessageEvent(event);
      break;
    case "follow":
      console.log("User followed the bot:", event.source.userId);
      break;
    case "unfollow":
      console.log("User unfollowed the bot:", event.source.userId);
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }
}

/**
 * Handle message events
 */
async function handleMessageEvent(event: LineWebhookEvent): Promise<void> {
  if (!event.message || event.message.type !== "text" || !event.message.text) {
    console.log("Received non-text message");
    return;
  }

  const text = event.message.text;
  const userId = event.source.userId || "unknown";

  console.log(`Message from ${userId}: ${text}`);

  // Store the message for the web chat to retrieve
  addMessage({
    text,
    userId,
    timestamp: event.timestamp,
  });
}

/**
 * Handle GET requests (for webhook URL verification)
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    message: "LINE Webhook endpoint is active",
  });
}
