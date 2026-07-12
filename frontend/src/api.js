const API_BASE_URL = 
  typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:3000"
    : "https://code-hub-live.vercel.app";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
