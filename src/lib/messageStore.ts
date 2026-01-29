import type { StoredMessage } from "@type/line.type";

// In-memory message store (for demo purposes)
// In production, use a database like Redis, PostgreSQL, etc.
const messages: StoredMessage[] = [];
const MAX_MESSAGES = 100;

/**
 * Add a new message to the store
 */
export const addMessage = (
  message: Omit<StoredMessage, "id">
): StoredMessage => {
  const newMessage: StoredMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  };

  messages.push(newMessage);

  // Keep only the last MAX_MESSAGES
  if (messages.length > MAX_MESSAGES) {
    messages.shift();
  }

  return newMessage;
};

/**
 * Get messages after a specific timestamp
 */
export const getMessagesSince = (timestamp: number): StoredMessage[] =>
  messages.filter((msg) => msg.timestamp > timestamp);

/**
 * Get all messages
 */
export const getAllMessages = (): StoredMessage[] => [...messages];

/**
 * Clear all messages
 */
export const clearMessages = (): void => {
  messages.length = 0;
};
