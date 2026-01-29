import type { StoredMessage } from "@type/line.type";
import fs from "node:fs";
import path from "node:path";

const DATA_FILE = path.join(process.cwd(), "data", "messages.json");
const MAX_MESSAGES = 1000;

// Ensure data directory exists
const ensureDataDir = (): void => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Load messages from file
const loadMessages = (): StoredMessage[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
  return [];
};

// Save messages to file
const saveMessages = (messages: StoredMessage[]): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
};

// Initialize messages from file
const messages: StoredMessage[] = loadMessages();

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

  saveMessages(messages);
  return newMessage;
};

export const getMessagesSince = (timestamp: number): StoredMessage[] =>
  messages.filter((msg) => msg.timestamp > timestamp);

export const getAllMessages = (): StoredMessage[] => [...messages];

export const clearMessages = (): void => {
  messages.length = 0;
  saveMessages(messages);
};
