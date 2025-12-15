import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import type { BatchPredictionResponse } from "@/lib/api";
import { PredictionCard } from "./prediction-result";

interface BatchResultsProps {
    data: BatchPredictionResponse;
    files: File[];
}

export function BatchResults({ data, files }: BatchResultsProps) {
    const fileMap = useMemo(() => {
        const map = new Map<string, File>();
        files.forEach((file) => map.set(file.name, file));
        return map;
    }, [files]);

    return (
        <Card className="mt-8" role="region" aria-label="Batch processing results">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Batch Processing Results
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-2 items-center">
                    <span>Processed {data.total_processed} files:</span>
                    <Badge variant="default" className="gap-1">
                        <CheckCircle className="w-3 h-3" aria-hidden="true" />
                        {data.success_count} successful
                    </Badge>
                    {data.error_count > 0 && (
                        <Badge variant="destructive" className="gap-1">
                            <XCircle className="w-3 h-3" aria-hidden="true" />
                            {data.error_count} errors
                        </Badge>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        role="list"
                        aria-label="Classification results"
                    >
                        {data.results.map((result, index) => {
                            const file = fileMap.get(result.filename);

                            return (
                                <div key={`${result.filename}-${index}`} role="listitem">
                                    <PredictionCard
                                        result={result}
                                        file={file}
                                        className="h-full max-w-sm mx-auto"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
