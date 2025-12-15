import axios from 'axios';

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

// --- API Client ---

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

// --- Endpoints ---

export const predictImage = async (file: File): Promise<PredictionResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PredictionResult>('/predict/image/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const predictAudio = async (file: File): Promise<PredictionResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PredictionResult>('/predict/audio/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const batchPredictImage = async (files: File[]): Promise<BatchPredictionResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const response = await api.post<BatchPredictionResponse>('/predict/batch/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const batchPredictAudio = async (files: File[]): Promise<BatchPredictionResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const response = await api.post<BatchPredictionResponse>('/predict/batch/audio', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
