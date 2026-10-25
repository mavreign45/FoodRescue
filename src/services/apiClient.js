/**
 * Shared HTTP client for the FoodRescue API.
 *
 * The backend base URL is configured through VITE_API_BASE_URL and defaults
 * to the agreed local API prefix.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "");

/** Prototype mode is on unless an environment explicitly turns it off. */
export const SAMPLE_DATA_ENABLED =
  import.meta.env.VITE_USE_SAMPLE_DATA !== "false";

export class ApiError extends Error {
  constructor(message, { status = 0, code = "request_failed", details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getAuthToken() {
  try {
    return window.localStorage.getItem("foodrescue.auth_token");
  } catch {
    return null;
  }
}

function buildUrl(path, query) {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
  );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function parseError(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    // Some error responses have no JSON body.
  }

  const message =
    payload?.detail ||
    payload?.message ||
    (response.status === 404
      ? "We couldn't find that item."
      : "Something went wrong while talking to FoodRescue.");

  return new ApiError(message, {
    status: response.status,
    code: payload?.code ?? `http_${response.status}`,
    details: payload,
  });
}

async function request(path, { method = "GET", body, query, headers, signal } = {}) {
  const token = getAuthToken();
  const isFormData = body instanceof FormData;
  const requestHeaders = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  let response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "We couldn't reach the FoodRescue API. Check your connection and try again.",
      { code: "network_error", details: error },
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json")
    ? response.json()
    : response.text();
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) =>
    request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) =>
    request(path, { ...options, method: "DELETE" }),
};
