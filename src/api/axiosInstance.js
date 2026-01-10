import axios from "axios";
import toast from "react-hot-toast";
import i18n from "../i18n";
import { getApiErrorMessageKey } from "../utils/i18nError";

const shouldHttpTrace = (() => {
  // Enable verbose HTTP tracing only in dev. You can force-enable/disable via env.
  // - VITE_HTTP_TRACE=true  -> enable
  // - VITE_HTTP_TRACE=false -> disable
  const flag = String(import.meta.env.VITE_HTTP_TRACE || "").toLowerCase();
  if (flag === "true" || flag === "1" || flag === "yes") return true;
  if (flag === "false" || flag === "0" || flag === "no") return false;
  return !!import.meta.env.DEV;
})();

const redactAuthHeader = (value) => {
  if (!value) return value;
  const s = String(value);
  if (!s.toLowerCase().startsWith("bearer ")) return "<redacted>";
  const token = s.slice(7);
  if (token.length <= 12) return "Bearer <redacted>";
  return `Bearer ${token.slice(0, 6)}…${token.slice(-4)} (len=${token.length})`;
};

const buildAbsoluteUrl = (baseURL, url) => {
  try {
    // url may already be absolute.
    return new URL(url, baseURL || window.location.origin).toString();
  } catch {
    return `${baseURL || ""}${url || ""}`;
  }
};

const safeJsonParse = (v) => {
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  if (!trimmed) return v;
  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return v;
  try {
    return JSON.parse(trimmed);
  } catch {
    return v;
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Required for Google Calendar OAuth binding cookie (SameSite=None; Secure)
  // to be accepted and sent on cross-site requests.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper to get token from either storage
const getToken = () => {
  return (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
};

// Request interceptor - Auto-attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (shouldHttpTrace) {
      const method = (config.method || "get").toUpperCase();
      const absoluteUrl = buildAbsoluteUrl(config.baseURL, config.url);
      const headers = { ...(config.headers || {}) };
      if (headers.Authorization)
        headers.Authorization = redactAuthHeader(headers.Authorization);

      // Store a snapshot so the error interceptor can report the exact request.
      config.__trace = {
        method,
        url: absoluteUrl,
        headers,
        body: safeJsonParse(config.data),
        ts: new Date().toISOString(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle API response format and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle standard ApiResponse wrapper format
    const data = response.data;
    if (data && typeof data === "object" && "success" in data) {
      if (!data.success) {
        // API returned success: false
        const errorMessage = data.message || i18n.t("errors.generic");
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(", ");
          toast.error(errorMessages || errorMessage);
        } else {
          toast.error(errorMessage);
        }
        return Promise.reject(new Error(errorMessage));
      }
      // Return unwrapped data for successful responses
      return { ...response, data: data.data, message: data.message };
    }
    return response;
  },
  (error) => {
    const { response } = error;

    if (shouldHttpTrace) {
      const trace = error?.config?.__trace;
      const status = response?.status;

      // Capture the very first 400 to avoid masking the real root cause.
      if (
        status === 400 &&
        typeof window !== "undefined" &&
        !window.__FIRST_HTTP_400__
      ) {
        const first = {
          request: trace || {
            method: (error?.config?.method || "get").toUpperCase(),
            url: buildAbsoluteUrl(error?.config?.baseURL, error?.config?.url),
            headers: (() => {
              const h = { ...(error?.config?.headers || {}) };
              if (h.Authorization)
                h.Authorization = redactAuthHeader(h.Authorization);
              return h;
            })(),
            body: safeJsonParse(error?.config?.data),
            ts: new Date().toISOString(),
          },
          response: {
            status,
            headers: response?.headers || null,
            body: response?.data ?? null,
          },
        };

        window.__FIRST_HTTP_400__ = first;

        // This is designed to be copy-pasted back for debugging.
        console.group("[HTTP FIRST 400] Capture");
        console.log("Request:", first.request);
        console.log("Response:", first.response);
        console.log(
          "Tip: You can also run `copy(window.__FIRST_HTTP_400__)` in DevTools console to copy this object."
        );
        console.groupEnd();
      }
    }

    if (response) {
      const apiResponse = response.data;
      const messageKey = getApiErrorMessageKey(error);
      const translated = messageKey ? i18n.t(messageKey) : null;
      const message =
        translated || apiResponse?.message || i18n.t("errors.generic");

      switch (response.status) {
        case 401:
          // Clear both storages on 401
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          localStorage.removeItem("rememberMe");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("user");
          {
            const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
            const from = encodeURIComponent(currentPath);
            window.location.href = `/login?from=${from}`;
          }
          toast.error(i18n.t("auth.sessionExpired"));
          break;
        case 403:
          toast.error(i18n.t("errors.permissionDenied"));
          break;
        case 404:
          toast.error(
            apiResponse?.message || i18n.t("errors.resourceNotFound")
          );
          break;
        case 400:
          if (apiResponse?.errors) {
            const errorMessages = Object.values(apiResponse.errors)
              .flat()
              .join(", ");
            toast.error(errorMessages || message);
          } else {
            toast.error(message);
          }
          break;
        case 500:
          toast.error(i18n.t("errors.serverErrorTryLater"));
          break;
        default:
          toast.error(message);
      }
    } else {
      toast.error(i18n.t("errors.networkErrorCheckConnection"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
