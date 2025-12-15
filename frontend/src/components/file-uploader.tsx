import { useCallback } from 'react'
import type { DropzoneOptions } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import { Upload, FileAudio, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void
    accept: DropzoneOptions['accept']
    maxFiles?: number
    disabled?: boolean
    className?: string
}

export function FileUploader({
    onFilesSelected,
    accept,
    maxFiles = 1,
    disabled = false,
    className,
}: FileUploaderProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFilesSelected(acceptedFiles)
        },
        [onFilesSelected]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        disabled,
    })

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-all hover:bg-muted/50 cursor-pointer',
                isDragActive && 'border-primary bg-primary/5',
                isDragReject && 'border-destructive bg-destructive/5',
                disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="p-4 rounded-full bg-muted">
                    <Upload className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium text-foreground">
                        {isDragActive
                            ? 'Drop the files here'
                            : 'Drag & drop files here, or click to select'}
                    </p>
                    <p className="text-sm">
                        Supported formats: {Object.keys(accept || {}).join(', ')}
                    </p>
                </div>
            </div>
        </div>
    )
}

interface FilePreviewProps {
    file: File
    onRemove?: () => void
    viewMode?: 'list' | 'large' | 'grid'
}

export function FilePreview({ file, onRemove, viewMode = 'list' }: FilePreviewProps) {
    const isImage = file.type.startsWith('image/')

    if (viewMode === 'large') {
        return (
            <Card className="relative overflow-hidden group">
                <div className="w-full bg-muted/20 flex items-center justify-center overflow-hidden p-4">
                    {isImage ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-full h-auto max-h-[60vh] object-contain rounded shadow-sm"
                        />
                    ) : (
                        <FileAudio className="w-24 h-24 text-muted-foreground" />
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
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </Card>
        )
    }

    if (viewMode === 'grid') {
        return (
            <Card className="relative overflow-hidden group hover:ring-2 hover:ring-primary transition-all flex flex-col shrink-0">
                <div className="p-2 flex-grow flex items-center justify-center bg-muted/20 min-h-[150px]">
                    {isImage ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="h-40 w-auto object-contain rounded"
                        />
                    ) : (
                        <FileAudio className="w-12 h-12 text-muted-foreground" />
                    )}
                </div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onRemove && (
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={onRemove}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    )}
                </div>
                <div className="p-2 border-t">
                    <p className="text-xs font-medium truncate max-w-[150px]">{file.name}</p>
                </div>
            </Card>
        )
    }

    // List mode (default)
    return (
        <Card className="flex items-center gap-4 p-4 mt-4 relative overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted shrink-0">
                {isImage ? (
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <FileAudio className="w-6 h-6 text-muted-foreground" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
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
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </Card>
    )
}
