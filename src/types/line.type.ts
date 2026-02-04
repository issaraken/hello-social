export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "line";
  timestamp: Date;
  status?: "sending" | "sent" | "failed";
}

export interface SendMessageRequest {
  message: string;
  userId?: string; // Optional: specific user ID, defaults to env LINE_USER_ID
}

export interface SendMessageResponse {
  success: boolean;
  error?: string;
}

export interface LineWebhookEvent {
  type: string;
  timestamp: number;
  source: {
    type: string;
    userId?: string;
    groupId?: string;
    roomId?: string;
  };
  replyToken?: string;
  message?: {
    id: string;
    type: string;
    text?: string;
  };
}

export interface LineWebhookBody {
  destination: string;
  events: LineWebhookEvent[];
}

export interface StoredMessage {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
  direction: "incoming" | "outgoing";
}

export interface StoredUser {
  id: string;
  displayName?: string;
  lastMessageAt: number;
}

export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}
