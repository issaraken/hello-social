import type { StoredUser } from "@type/line.type";
import fs from "node:fs";
import path from "node:path";

const DATA_FILE = path.join(process.cwd(), "data", "users.json");
const ensureDataDir = (): void => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const loadUsers = (): StoredUser[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load users:", error);
  }
  return [];
};

const saveUsers = (users: StoredUser[]): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Failed to save users:", error);
  }
};

const users: StoredUser[] = loadUsers();

export const addOrUpdateUser = (
  userId: string,
  displayName?: string
): StoredUser => {
  const existingIndex = users.findIndex((u) => u.id === userId);
  const now = Date.now();

  if (existingIndex >= 0) {
    users[existingIndex].lastMessageAt = now;
    if (displayName) {
      users[existingIndex].displayName = displayName;
    }
    saveUsers(users);
    return users[existingIndex];
  }

  const newUser: StoredUser = {
    id: userId,
    displayName,
    lastMessageAt: now,
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const getUser = (userId: string): StoredUser | undefined =>
  users.find((u) => u.id === userId);

export const getAllUsers = (): StoredUser[] =>
  [...users].sort((a, b) => b.lastMessageAt - a.lastMessageAt);
