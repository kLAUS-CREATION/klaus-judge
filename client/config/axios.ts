import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/lib/utils/cookies";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    "API_URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local",
  );
}

console.log("[Axios] Using API URL:", apiUrl);

const apiClient = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  timeout: 50000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = getRefreshToken();
//         if (!refreshToken) {
//           console.warn(
//             "[Axios] No refresh token available, redirecting to login",
//           );
//           clearTokens();
//           if (typeof window !== "undefined") {
//             window.location.href = "/auth/sign-in";
//           }
//           throw new Error("No refresh token");
//         }

//         console.log("[Axios] Attempting to refresh token...");

//         const response = await axios.post(
//           `${apiUrl}/api/v1/auth/refresh`,
//           { refresh_token: refreshToken },
//           { timeout: 10000 },
//         );

//         const { access_token, refresh_token: newRefreshToken } = response.data;

//         setTokens(access_token, newRefreshToken);
//         console.log("[Axios] Token refreshed successfully");

//         originalRequest.headers.Authorization = `Bearer ${access_token}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         console.error("[Axios] Token refresh failed:", refreshError);
//         clearTokens();
//         if (typeof window !== "undefined") {
//           window.location.href = "/auth/sign-in";
//         }
//         return Promise.reject(refreshError);
//       }
//     }

//     if (error.response) {
//       console.error(
//         "[Axios] Error:",
//         error.response.status,
//         error.response.data,
//       );
//     } else if (error.request) {
//       console.error("[Axios] No response received:", error.request);
//     } else {
//       console.error("[Axios] Request error:", error.message);
//     }

//     return Promise.reject(error);
//   },
// );

export default apiClient;
