import axios, { AxiosError } from "axios";
import { getLineConfig } from "@/config/line.config";

const handleError = (error: AxiosError) => {
  console.error("API Error:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    data: error.response?.data,
  });
  return Promise.reject(error);
};

export const isAxiosError = axios.isAxiosError;

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use((response) => response, handleError);

export const createLineApiClient = () => {
  const config = getLineConfig();

  const client = axios.create({
    baseURL: config.apiBase,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.channelAccessToken}`,
    },
    timeout: config.timeout,
  });

  client.interceptors.response.use((response) => response, handleError);

  return client;
};
