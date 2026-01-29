import type { StoredMessage } from "@type/line.type";

const messages: StoredMessage[] = [];
const MAX_MESSAGES = 100;

export const addMessage = (
  message: Omit<StoredMessage, "id">
): StoredMessage => {
  const newMessage: StoredMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  };

  messages.push(newMessage);

  if (messages.length > MAX_MESSAGES) {
    messages.shift();
  }

  return newMessage;
};

export const getMessagesSince = (timestamp: number): StoredMessage[] =>
  messages.filter((msg) => msg.timestamp > timestamp);

export const getAllMessages = (): StoredMessage[] => [...messages];

export const clearMessages = (): void => {
  messages.length = 0;
};
