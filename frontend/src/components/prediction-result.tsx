import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Play, Pause } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import type { PredictionResult } from '@/lib/api'
import { cn } from '@/lib/utils'

interface PredictionCardProps {
    result: PredictionResult
    file?: File | null
    className?: string
}

export function PredictionCard({ result, file, className }: PredictionCardProps) {
    const isAudio = result.media_type === 'audio'
    const confidencePercent = Math.round(result.confidence * 100)

    return (
        <Card className={cn("w-full overflow-hidden", className)}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center text-lg">
                    <span className="truncate mr-2">Prediction Result</span>
                    <Badge variant={confidencePercent > 80 ? 'default' : 'secondary'}>
                        {confidencePercent}% Confidence
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Identified Instrument</p>
                    <h2 className="text-3xl font-bold capitalize text-primary">
                        {result.predicted_label}
                    </h2>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Confidence Score</span>
                        <span>{result.confidence.toFixed(4)}</span>
                    </div>
                    <Progress value={confidencePercent} />
                </div>

                {isAudio && file && (
                    <div className="pt-4 border-t">
                        <AudioPlayer file={file} />
                    </div>
                )}

                {result.media_type === 'image' && file && (
                    <div className="rounded-lg overflow-hidden border">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded Instrument"
                            className="w-full h-auto"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function AudioPlayer({ file }: { file: File }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const wavesurfer = useRef<WaveSurfer | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (!containerRef.current) return

        wavesurfer.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: 'rgb(209 213 219)',
            progressColor: 'rgb(59 130 246)',
            cursorColor: 'rgb(59 130 246)',
            barWidth: 2,
            barGap: 1,
            height: 60,
        })

        const url = URL.createObjectURL(file)
        wavesurfer.current.load(url)

        wavesurfer.current.on('finish', () => setIsPlaying(false))

        return () => {
            wavesurfer.current?.destroy()
            URL.revokeObjectURL(url)
        }
    }, [file])

    const togglePlay = () => {
        if (wavesurfer.current) {
            wavesurfer.current.playPause()
            setIsPlaying(wavesurfer.current.isPlaying())
        }
    }

    return (
        <div className="space-y-4">
            <div ref={containerRef} />
            <div className="flex justify-center">
                <Button size="icon" onClick={togglePlay} className="rounded-full w-12 h-12">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
            </div>
        </div>
    )
}
