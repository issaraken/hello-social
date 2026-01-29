export interface LineConfig {
  apiBase: string;
  channelAccessToken: string;
  channelSecret: string;
  userId: string;
  timeout: number;
}

const defaultConfig = {
  apiBase: "https://api.line.me/v2/bot",
  channelAccessToken:
    "zcPMnVrKd4oCc50a59XllEy9uxhpw4epmSoVYTJl0f+ipMNyNwFzt/03GwdJoh6xyqbfgnveWzHobfmvkNrbw03jTax89pSA/PDS5+b4GejHTaVpXrpVPhc5Dmeelx3vbO3WrM1H5/EY+uw6Rj0I8QdB04t89/1O/w1cDnyilFU=",
  channelSecret: "4056391f306994b3e6b39262358e5e1d",
  userId: "Uf82be627655944c63fa34331c6a3701d",
  timeout: 10000,
} as const;

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`${key} is not configured`);
  }
  return value || defaultValue || "";
};

export const getLineConfig = (): LineConfig => ({
  apiBase: getEnv("LINE_API_BASE", defaultConfig.apiBase),
  channelAccessToken: getEnv(
    "LINE_CHANNEL_ACCESS_TOKEN",
    defaultConfig.channelAccessToken
  ),
  channelSecret: getEnv("LINE_CHANNEL_SECRET", defaultConfig.channelSecret),
  userId: getEnv("LINE_USER_ID", defaultConfig.userId),
  timeout: Number(getEnv("LINE_TIMEOUT", String(defaultConfig.timeout))),
});

export const getApiBase = (): string =>
  getEnv("LINE_API_BASE", defaultConfig.apiBase);

export const getChannelAccessToken = (): string =>
  getEnv("LINE_CHANNEL_ACCESS_TOKEN", defaultConfig.channelAccessToken);

export const getChannelSecret = (): string =>
  getEnv("LINE_CHANNEL_SECRET", defaultConfig.channelSecret);

export const getDefaultUserId = (): string =>
  getEnv("LINE_USER_ID", defaultConfig.userId);

export const getTimeout = (): number =>
  Number(getEnv("LINE_TIMEOUT", String(defaultConfig.timeout)));
