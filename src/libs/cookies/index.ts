const TOKEN_KEY = "dwp_token";

export const cookieLib = {
  getToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },

  setToken(token: string, days = 7): void {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
  },

  removeToken(): void {
    if (typeof document === "undefined") return;
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  },
};
