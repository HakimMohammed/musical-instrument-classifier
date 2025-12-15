import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  predictImage,
  predictAudio,
  batchPredictImage,
  batchPredictAudio,
  type PredictionResult,
  type BatchPredictionResponse,
  formatApiError,
} from "@/lib/api";

interface UseClassifierOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useImageClassifier(options: UseClassifierOptions = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: predictImage,
    onSuccess: () => {
      toast.success("Image processed successfully");
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(formatApiError(error, "Error processing image"));
      options.onError?.(error);
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const classify = useCallback(
    (file: File) => {
      setSelectedFile(file);
      mutation.mutate(file);
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setSelectedFile(null);
    mutation.reset();
  }, [mutation]);

  return {
    selectedFile,
    result: mutation.data as PredictionResult | undefined,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    classify,
    reset,
    retry: () => selectedFile && mutation.mutate(selectedFile),
  };
}

export function useAudioClassifier(options: UseClassifierOptions = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: predictAudio,
    onSuccess: () => {
      toast.success("Audio processed successfully");
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(formatApiError(error, "Error processing audio"));
      options.onError?.(error);
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const classify = useCallback(
    (file: File) => {
      setSelectedFile(file);
      mutation.mutate(file);
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setSelectedFile(null);
    mutation.reset();
  }, [mutation]);

  return {
    selectedFile,
    result: mutation.data as PredictionResult | undefined,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    classify,
    reset,
    retry: () => selectedFile && mutation.mutate(selectedFile),
  };
}

export function useBatchImageClassifier(options: UseClassifierOptions = {}) {
  const [files, setFiles] = useState<File[]>([]);

  const mutation = useMutation({
    mutationFn: batchPredictImage,
    onSuccess: () => {
      toast.success("Batch processing complete");
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(formatApiError(error, "Error in batch processing"));
      options.onError?.(error);
    },
    retry: 1,
    retryDelay: 2000,
  });

  const classify = useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles);
      mutation.mutate(newFiles);
    },
    [mutation]
  );

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        if (newFiles.length === 0) {
          mutation.reset();
        }
        return newFiles;
      });
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setFiles([]);
    mutation.reset();
  }, [mutation]);

  return {
    files,
    result: mutation.data as BatchPredictionResponse | undefined,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    classify,
    removeFile,
    reset,
    retry: () => files.length > 0 && mutation.mutate(files),
  };
}

export function useBatchAudioClassifier(options: UseClassifierOptions = {}) {
  const [files, setFiles] = useState<File[]>([]);

  const mutation = useMutation({
    mutationFn: batchPredictAudio,
    onSuccess: () => {
      toast.success("Batch processing complete");
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(formatApiError(error, "Error in batch processing"));
      options.onError?.(error);
    },
    retry: 1,
    retryDelay: 2000,
  });

  const classify = useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles);
      mutation.mutate(newFiles);
    },
    [mutation]
  );

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        if (newFiles.length === 0) {
          mutation.reset();
        }
        return newFiles;
      });
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setFiles([]);
    mutation.reset();
  }, [mutation]);

  return {
    files,
    result: mutation.data as BatchPredictionResponse | undefined,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    classify,
    removeFile,
    reset,
    retry: () => files.length > 0 && mutation.mutate(files),
  };
}
