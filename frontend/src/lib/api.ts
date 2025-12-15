import axios, { AxiosError } from "axios";

// --- Types ---

export interface PredictionResult {
  filename: string;
  media_type: string;
  predicted_label: string;
  confidence: number;
}

export interface BatchPredictionResponse {
  results: PredictionResult[];
  total_processed: number;
  success_count: number;
  error_count: number;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// --- Error Formatting ---

export function formatApiError(
  error: unknown,
  fallback: string = "An error occurred"
): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<
      HTTPValidationError | { detail: string }
    >;

    if (axiosError.response?.data) {
      const data = axiosError.response.data;

      // Handle validation errors
      if ("detail" in data && Array.isArray(data.detail)) {
        const validationErrors = data.detail as ValidationError[];
        if (validationErrors.length > 0) {
          return validationErrors.map((e) => e.msg).join(", ");
        }
      }

      // Handle simple error messages
      if ("detail" in data && typeof data.detail === "string") {
        return data.detail;
      }
    }

    // Handle network errors
    if (axiosError.code === "ERR_NETWORK") {
      return "Unable to connect to the server. Please check your connection.";
    }

    // Handle timeout
    if (axiosError.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }

    // Handle HTTP status codes
    if (axiosError.response?.status) {
      const status = axiosError.response.status;
      if (status === 413) return "File is too large for the server to process.";
      if (status === 415) return "Unsupported file format.";
      if (status === 500) return "Server error. Please try again later.";
      if (status === 503)
        return "Service temporarily unavailable. Please try again.";
    }

    return axiosError.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

// --- API Client ---

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 second timeout for large files
});

// --- Endpoints (normalized URLs without trailing slashes) ---

export const predictImage = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<PredictionResult>(
    "/predict/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const predictAudio = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<PredictionResult>(
    "/predict/audio",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const batchPredictImage = async (
  files: File[]
): Promise<BatchPredictionResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post<BatchPredictionResponse>(
    "/predict/batch/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const batchPredictAudio = async (
  files: File[]
): Promise<BatchPredictionResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post<BatchPredictionResponse>(
    "/predict/batch/audio",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
