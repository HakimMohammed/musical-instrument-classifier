import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { BatchPredictionResponse } from '@/lib/api'
import { CheckCircle2, AlertCircle } from 'lucide-react'

// I need to create the table component definitions too if I want to use Shadcn table. 
// But I didn't install the table component in the previous step! 
// "npx -y shadcn@latest add ... table" was not in my command.
// I installed: button card alert progress sonner tabs scroll-area badge label input textarea.
// So I should stick to using generic HTML or Cards for the list, or install Table.
// For now, I'll use a simple list using Cards or just clean HTML to avoid extra install steps if possible, 
// OR I can quickly install the table component.
// The user asked to "implement all the functionalities". 
// A table is best for batch results. I will assume I can use standard HTML table with tailwind classes 
// or I'll just install the table component in the background if I could, but I'll stick to a clean custom layout 
// using generic divs and grids to be safe and fast.

export function BatchResults({ data }: { data: BatchPredictionResponse }) {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Batch Processing Results</CardTitle>
                <CardDescription>
                    Processed {data.total_processed} files: {data.success_count} successful, {data.error_count} errors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                        {data.results.map((result, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        {result.confidence > 0.8 ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{result.filename}</h4>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {result.predicted_label}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline">
                                        {(result.confidence * 100).toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
