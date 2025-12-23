import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/**
 * ============================
 * REQUEST INTERCEPTOR
 * ============================
 */
api.interceptors.request.use((config) => {
  const isPublicRequest =
    config.headers?.["x-public-request"] === "true";

  if (isPublicRequest) {
    config.withCredentials = false;
    delete config.headers?.Authorization;
    delete config.headers?.["x-public-request"];
    return config;
  }

  // AUTH REQUEST
  config.withCredentials = true;

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * ============================
 * RESPONSE INTERCEPTOR
 * ============================
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("API timeout:", error.message);
    } else if (!error.response) {
      console.error("API no response (CORS / network)");
    } else {
      console.error("API error:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
