import { useCallback, useEffect, useRef, useState } from "react";
import type { DropzoneOptions } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPreview } from "@/components/audio-preview";
import { toast } from "sonner";

const MAX_FILE_SIZE_MB = 50;

// Helper component for image preview - uses ref-based URL management to avoid
// React Strict Mode double-render issues where URL gets revoked before image loads
function ImagePreviewThumbnail({
  file,
  className,
}: {
  file: File;
  className?: string;
}) {
  const [src, setSrc] = useState<string>("");
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    // Create new URL
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setSrc(url);

    // Cleanup only when file changes or component unmounts
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={`Preview of ${file.name}`}
      className={cn("rounded-lg", className)}
    />
  );
}

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept: DropzoneOptions["accept"];
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
}

export function FileUploader({
  onFilesSelected,
  accept,
  maxFiles = 1,
  maxSizeMB = MAX_FILE_SIZE_MB,
  disabled = false,
  className,
  showPreview = false,
}: FileUploaderProps) {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      const validFiles: File[] = [];

      for (const file of files) {
        if (file.size > maxSizeBytes) {
          toast.error(`"${file.name}" exceeds ${maxSizeMB}MB limit`);
          continue;
        }
        validFiles.push(file);
      }

      return validFiles;
    },
    [maxSizeBytes, maxSizeMB]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = validateFiles(acceptedFiles);
      if (validFiles.length === 0) return;

      if (showPreview) {
        setPreviewFiles(validFiles);
      } else {
        onFilesSelected(validFiles);
      }
    },
    [onFilesSelected, showPreview, validateFiles]
  );

  const handleConfirmUpload = useCallback(() => {
    onFilesSelected(previewFiles);
    setPreviewFiles([]);
  }, [onFilesSelected, previewFiles]);

  const handleCancelPreview = useCallback(() => {
    setPreviewFiles([]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled,
    maxSize: maxSizeBytes,
  });

  // Show rejection errors
  useEffect(() => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((error) => {
        if (error.code === "file-too-large") {
          toast.error(`"${file.name}" exceeds ${maxSizeMB}MB limit`);
        } else if (error.code === "file-invalid-type") {
          toast.error(`"${file.name}" has an unsupported format`);
        } else {
          toast.error(error.message);
        }
      });
    });
  }, [fileRejections, maxSizeMB]);

  // Show preview mode for files before upload
  if (showPreview && previewFiles.length > 0) {
    const isAudio = previewFiles[0].type.startsWith("audio/");
    const isImage = previewFiles[0].type.startsWith("image/");

    return (
      <Card className="p-6 space-y-4">
        <div className="text-center">
          <p className="font-medium mb-2">Preview before upload</p>
          <p className="text-sm text-muted-foreground">
            {previewFiles.length} {previewFiles.length === 1 ? 'file' : 'files'} ready to upload
          </p>
        </div>

        {/* Single audio preview */}
        {isAudio && previewFiles.length === 1 && (
          <AudioPreview file={previewFiles[0]} />
        )}

        {/* Single image preview */}
        {isImage && previewFiles.length === 1 && (
          <ImagePreviewThumbnail
            file={previewFiles[0]}
            className="max-h-64 mx-auto"
          />
        )}

        {/* Multiple files grid preview */}
        {previewFiles.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2">
            {previewFiles.map((file, i) => (
              <div key={i} className="relative">
                {file.type.startsWith("image/") ? (
                  <ImagePreviewThumbnail
                    file={file}
                    className="h-24 w-full object-cover rounded"
                  />
                ) : (
                  <div className="h-24 w-full flex items-center justify-center bg-muted rounded">
                    <FileAudio className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <p className="text-xs truncate mt-1" title={file.name}>
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancelPreview}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirmUpload}>
            Upload & Analyze
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={0}
      aria-label={`Upload ${maxFiles > 1 ? "files" : "file"
        }. Drag and drop or click to select.`}
      aria-describedby="upload-description"
      className={cn(
        "relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-all hover:bg-muted/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isDragActive && "border-primary bg-primary/5",
        isDragReject && "border-destructive bg-destructive/5",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
        className
      )}
    >
      <input {...getInputProps()} aria-label="File input" />
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div
          className={cn(
            "p-4 rounded-full bg-muted transition-colors",
            isDragReject && "bg-destructive/10"
          )}
        >
          {isDragReject ? (
            <AlertCircle className="w-8 h-8 text-destructive" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        <div className="flex flex-col gap-1" id="upload-description">
          <p className="text-lg font-medium text-foreground">
            {isDragReject
              ? "Invalid file type"
              : isDragActive
                ? "Drop the files here"
                : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-sm">
            Supported formats: {Object.keys(accept || {}).join(", ")}
          </p>
          <p className="text-xs mt-1">
            Max file size: {maxSizeMB}MB{" "}
            {maxFiles > 1 && `• Max ${maxFiles} files`}
          </p>
        </div>
      </div>
    </div>
  );
}

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  viewMode?: "list" | "large" | "grid";
}

export function FilePreview({
  file,
  onRemove,
  viewMode = "list",
}: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");

  // Use state + ref pattern to avoid React Strict Mode double-render URL revocation issues
  const [objectUrl, setObjectUrl] = useState<string>("");
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setObjectUrl(url);

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file]);

  if (viewMode === "large") {
    return (
      <Card className="relative overflow-hidden group">
        <div className="w-full bg-muted/20 flex items-center justify-center overflow-hidden p-4">
          {isImage ? (
            objectUrl ? (
              <img
                src={objectUrl}
                alt={`Preview of ${file.name}`}
                className="w-full h-auto max-h-[60vh] object-contain rounded shadow-sm"
              />
            ) : (
              <div className="w-full h-48 bg-muted animate-pulse rounded" />
            )
          ) : isAudio ? (
            <div className="w-full max-w-md py-4">
              <AudioPreview file={file} />
            </div>
          ) : (
            <FileAudio
              className="w-24 h-24 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="p-4 flex items-center justify-between border-t">
          <div className="min-w-0">
            <p className="font-medium truncate text-lg">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              onClick={onRemove}
              aria-label={`Remove ${file.name}`}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (viewMode === "grid") {
    return (
      <Card className="relative overflow-hidden group hover:ring-2 hover:ring-primary transition-all flex flex-col shrink-0">
        <div className="p-2 flex-grow flex items-center justify-center bg-muted/20 min-h-[150px]">
          {isImage ? (
            objectUrl ? (
              <img
                src={objectUrl}
                alt={`Preview of ${file.name}`}
                className="h-40 w-auto object-contain rounded"
              />
            ) : (
              <div className="h-40 w-32 bg-muted animate-pulse rounded" />
            )
          ) : (
            <FileAudio
              className="w-12 h-12 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onRemove}
              aria-label={`Remove ${file.name}`}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        <div className="p-2 border-t">
          <p
            className="text-xs font-medium truncate max-w-[150px]"
            title={file.name}
          >
            {file.name}
          </p>
        </div>
      </Card>
    );
  }

  // List mode (default)
  return (
    <Card className="flex items-center gap-4 p-4 mt-4 relative overflow-hidden">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted shrink-0">
        {isImage ? (
          objectUrl ? (
            <img
              src={objectUrl}
              alt={`Preview of ${file.name}`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
          )
        ) : (
          <FileAudio
            className="w-6 h-6 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </Card>
  );
}
