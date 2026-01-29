// Chat Message Types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'line';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
}

// API Request/Response Types
export interface SendMessageRequest {
  message: string;
  userId?: string; // Optional: specific user ID, defaults to env LINE_USER_ID
}

export interface SendMessageResponse {
  success: boolean;
  error?: string;
}

// LINE Webhook Event Types
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

// Stored messages for webhook (in-memory storage)
export interface StoredMessage {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
}
