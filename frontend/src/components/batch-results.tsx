import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { BatchPredictionResponse } from '@/lib/api'
import { PredictionCard } from './prediction-result'

interface BatchResultsProps {
    data: BatchPredictionResponse;
    files: File[];
}

export function BatchResults({ data, files }: BatchResultsProps) {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Batch Processing Results</CardTitle>
                <CardDescription>
                    Processed {data.total_processed} files: {data.success_count} successful, {data.error_count} errors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.results.map((result, index) => {
                            // Find the file that matches the result filename
                            const file = files.find(f => f.name === result.filename);

                            return (
                                <PredictionCard
                                    key={index}
                                    result={result}
                                    file={file}
                                    className="h-full max-w-sm mx-auto"
                                />
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
