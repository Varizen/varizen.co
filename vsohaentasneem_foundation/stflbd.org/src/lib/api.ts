/**
 * STFL Canonical API Integration Layer
 * Source of Truth: https://stflbd.app/api/v1
 * 
 * Rules:
 * 1. Zero exposed server credentials or production secrets.
 * 2. Abstract state handling: loading, error, empty, unauthorized, forbidden, approval required, compliance hold, offline.
 * 3. Consistent error normalization and retry support.
 */

export const CANONICAL_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://stflbd.app/api/v1";

export type ApiStatus =
  | "IDLE"
  | "LOADING"
  | "SUCCESS"
  | "EMPTY"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "APPROVAL_REQUIRED"
  | "COMPLIANCE_HOLD"
  | "OFFLINE"
  | "ERROR";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  statusCode: number;
  message?: string;
  provenance?: {
    source: string;
    verified: boolean;
    timestamp: string;
    version: string;
  };
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  authToken?: string;
  projectId?: string;
}

export class ApiError extends Error {
  statusCode: number;
  statusType: ApiStatus;
  code?: string;

  constructor(message: string, statusCode: number, statusType: ApiStatus, code?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.statusType = statusType;
    this.code = code;
  }
}

/**
 * Universal safe fetch wrapper with retry and state classification
 */
async function fetchWithRetry<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeoutMs = 8000,
    retries = 1,
    authToken,
    projectId,
    headers = {},
    ...rest
  } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${CANONICAL_API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(projectId ? { "X-STFL-Project-Id": projectId } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  let attempts = 0;
  while (attempts <= retries) {
    attempts++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...rest,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Classify HTTP Status Codes
      if (response.status === 401) {
        throw new ApiError("Authentication required to access this resource", 401, "UNAUTHORIZED");
      }
      if (response.status === 403) {
        throw new ApiError("Access forbidden: your user class lacks required scope", 403, "FORBIDDEN");
      }
      if (response.status === 423) {
        throw new ApiError("Compliance Hold: action paused pending statutory review", 423, "COMPLIANCE_HOLD");
      }
      if (response.status === 428) {
        throw new ApiError("Precondition Required: executive approval required", 428, "APPROVAL_REQUIRED");
      }
      if (response.status === 404) {
        return {
          success: false,
          statusCode: 404,
          error: "Requested resource was not found",
          code: "NOT_FOUND",
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(errorText || `API error with status ${response.status}`, response.status, "ERROR");
      }

      const json = (await response.json()) as any;
      return {
        success: true,
        statusCode: response.status,
        data: json && json.data !== undefined ? json.data : json,
        provenance: json?.provenance,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === "AbortError") {
        if (attempts > retries) {
          throw new ApiError("Network request timed out", 408, "OFFLINE");
        }
      } else if (err instanceof ApiError) {
        throw err;
      } else if (attempts > retries) {
        throw new ApiError(
          err.message || "Network error. Please check your connection.",
          0,
          "OFFLINE"
        );
      }
    }
  }

  throw new ApiError("Unexpected termination of request loop", 500, "ERROR");
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    fetchWithRetry<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchWithRetry<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchWithRetry<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    fetchWithRetry<T>(endpoint, { ...options, method: "DELETE" }),

  /**
   * Public Verification Endpoint
   */
  async verifyDocument(documentId: string): Promise<ApiResponse<any>> {
    return fetchWithRetry(`/verify/${encodeURIComponent(documentId)}`, {
      retries: 2,
      timeoutMs: 6000,
    });
  },

  /**
   * Projects Catalog Endpoint
   */
  async getProjects(filter?: string): Promise<ApiResponse<any[]>> {
    const query = filter ? `?status=${encodeURIComponent(filter)}` : "";
    return fetchWithRetry(`/projects${query}`, {
      retries: 1,
      timeoutMs: 5000,
    });
  },
};
