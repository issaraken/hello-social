/**
 * LINE Configuration
 * Centralized configuration for LINE Messaging API
 */

export interface LineConfig {
  apiBase: string;
  channelAccessToken: string;
  channelSecret: string;
  userId: string;
  timeout: number;
}

/**
 * Default values for LINE configuration
 */
const defaultConfig = {
  apiBase: "https://api.line.me/v2/bot",
  timeout: 10000,
} as const;

/**
 * Get environment variable with optional default value
 */
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`${key} is not configured`);
  }
  return value || defaultValue || "";
};

/**
 * Get LINE configuration from environment variables
 * Uses default values when environment variables are not set
 */
export const getLineConfig = (): LineConfig => ({
  apiBase: getEnv("LINE_API_BASE", defaultConfig.apiBase),
  channelAccessToken: getEnv("LINE_CHANNEL_ACCESS_TOKEN"),
  channelSecret: getEnv("LINE_CHANNEL_SECRET"),
  userId: getEnv("LINE_USER_ID"),
  timeout: Number(getEnv("LINE_TIMEOUT", String(defaultConfig.timeout))),
});

/**
 * Get specific config values (for cases where you only need certain values)
 */
export const getApiBase = (): string =>
  getEnv("LINE_API_BASE", defaultConfig.apiBase);

export const getChannelAccessToken = (): string =>
  getEnv("LINE_CHANNEL_ACCESS_TOKEN");

export const getChannelSecret = (): string => getEnv("LINE_CHANNEL_SECRET");

export const getDefaultUserId = (): string => getEnv("LINE_USER_ID");

export const getTimeout = (): number =>
  Number(getEnv("LINE_TIMEOUT", String(defaultConfig.timeout)));
