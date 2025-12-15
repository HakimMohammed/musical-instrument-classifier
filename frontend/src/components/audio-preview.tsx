import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AudioPreviewProps {
  file: File;
  className?: string;
  compact?: boolean;
}

export function AudioPreview({
  file,
  className,
  compact = false,
}: AudioPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "hsl(var(--muted-foreground) / 0.4)",
      progressColor: "hsl(var(--primary))",
      cursorColor: "hsl(var(--primary))",
      barWidth: compact ? 2 : 3,
      barGap: 1,
      barRadius: 2,
      height: compact ? 40 : 60,
    });

    wavesurfer.current = ws;

    const url = URL.createObjectURL(file);
    ws.load(url);

    ws.on("ready", () => {
      setIsLoading(false);
      setDuration(ws.getDuration());
    });

    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("seeking", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));

    return () => {
      ws.destroy();
      URL.revokeObjectURL(url);
    };
  }, [file, compact]);

  const togglePlay = useCallback(() => {
    wavesurfer.current?.playPause();
  }, []);

  const toggleMute = useCallback(() => {
    if (wavesurfer.current) {
      const newMuted = !isMuted;
      wavesurfer.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        wavesurfer.current?.skip(-5);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        wavesurfer.current?.skip(5);
      }
    },
    [togglePlay, toggleMute]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn("space-y-3", className)}
      role="region"
      aria-label="Audio player"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {isLoading && (
        <Skeleton className={cn("w-full", compact ? "h-10" : "h-16")} />
      )}
      <div
        ref={containerRef}
        className={cn(isLoading && "hidden")}
        aria-hidden="true"
      />

      <div
        className={cn(
          "flex items-center gap-2",
          compact ? "justify-center" : "justify-between"
        )}
      >
        <div className="flex items-center gap-2">
          <Button
            size={compact ? "icon-sm" : "icon"}
            onClick={togglePlay}
            className="rounded-full"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <Pause className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
            ) : (
              <Play className={cn(compact ? "h-4 w-4" : "h-5 w-5", "ml-0.5")} />
            )}
          </Button>

          {!compact && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              aria-pressed={isMuted}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {!compact && (
          <div
            className="text-sm text-muted-foreground font-mono"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {isPlaying ? "Audio is playing" : "Audio is paused"}. Press Space or
        Enter to {isPlaying ? "pause" : "play"}, M to mute, and arrow keys to
        seek.
      </p>
    </div>
  );
}
