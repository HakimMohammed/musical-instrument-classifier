import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AudioPreview } from "@/components/audio-preview";
import type { PredictionResult } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PredictionCardProps {
  result: PredictionResult;
  file?: File | null;
  className?: string;
}

export function PredictionCard({
  result,
  file,
  className,
}: PredictionCardProps) {
  const isAudio = result.media_type === "audio";
  const isImage = result.media_type === "image";
  const confidencePercent = Math.round(result.confidence * 100);

  // Use state + ref pattern to avoid React Strict Mode double-render URL revocation issues
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      setObjectUrl(url);
    } else {
      setObjectUrl(null);
    }

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file]);

  const confidenceLevel =
    confidencePercent > 80 ? "high" : confidencePercent > 50 ? "medium" : "low";
  const confidenceLabel =
    confidencePercent > 80
      ? "High confidence"
      : confidencePercent > 50
      ? "Medium confidence"
      : "Low confidence";

  // Check if file is an image based on its MIME type (fallback if media_type doesn't match)
  const fileIsImage = file?.type?.startsWith("image/");
  const fileIsAudio = file?.type?.startsWith("audio/");
  const shouldShowImage = (isImage || fileIsImage) && objectUrl;
  const shouldShowAudio = (isAudio || fileIsAudio) && file;

  return (
    <Card
      className={cn("w-full overflow-hidden", className)}
      role="article"
      aria-label={`Prediction result: ${result.predicted_label} with ${confidencePercent}% confidence`}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-lg">
          <span className="truncate mr-2">Prediction Result</span>
          <Badge
            variant={confidenceLevel === "high" ? "default" : "secondary"}
            aria-label={confidenceLabel}
          >
            {confidencePercent}% Confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground" id="identified-label">
            Identified Instrument
          </p>
          <h2
            className="text-3xl font-bold capitalize text-primary"
            aria-labelledby="identified-label"
          >
            {result.predicted_label}
          </h2>
        </div>

        <div className="space-y-2" role="group" aria-label="Confidence score">
          <div className="flex justify-between text-sm">
            <span>Confidence Score</span>
            <span aria-hidden="true">{result.confidence.toFixed(4)}</span>
          </div>
          <Progress
            value={confidencePercent}
            aria-label={`Confidence: ${confidencePercent}%`}
            aria-valuenow={confidencePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {isAudio && file && (
          <div className="pt-4 border-t">
            <AudioPreview file={file} />
          </div>
        )}

        {shouldShowImage && (
          <div className="rounded-lg overflow-hidden border">
            <img
              src={objectUrl}
              alt={`Uploaded image identified as ${result.predicted_label}`}
              className="w-full h-auto"
            />
          </div>
        )}

        {shouldShowAudio && !isAudio && (
          <div className="pt-4 border-t">
            <AudioPreview file={file} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
