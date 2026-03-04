import axios from "axios";
import { envClient } from "@/configs/env-client.config";

const AUTH_STORE_KEY = "dwp-auth";

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
};

const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(AUTH_STORE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    parsed.state.token = null;
    parsed.state.user = null;
    parsed.state.isAuthenticated = false;
    localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
};

export const api = axios.create({
  baseURL: envClient.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearStoredAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
