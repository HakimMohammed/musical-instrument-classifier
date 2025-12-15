import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploader, FilePreview } from '@/components/file-uploader'
import { PredictionCard } from '@/components/prediction-result'
import { BatchResults } from '@/components/batch-results'
import { predictImage, predictAudio, batchPredictImage, batchPredictAudio } from '@/lib/api'
import { Music, ImageIcon, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [batchFiles, setBatchFiles] = useState<File[]>([])

  // Single Mutations
  const imageMutation = useMutation({
    mutationFn: predictImage,
    onSuccess: () => toast.success('Image processed successfully'),
    onError: (error) => toast.error(`Error processing image: ${error.message}`),
  })

  const audioMutation = useMutation({
    mutationFn: predictAudio,
    onSuccess: () => toast.success('Audio processed successfully'),
    onError: (error) => toast.error(`Error processing audio: ${error.message}`),
  })

  // Batch Mutations
  const batchImageMutation = useMutation({
    mutationFn: batchPredictImage,
    onSuccess: () => toast.success('Batch processing complete'),
    onError: (error) => toast.error(`Error in batch processing: ${error.message}`),
  })

  const batchAudioMutation = useMutation({
    mutationFn: batchPredictAudio,
    onSuccess: () => toast.success('Batch processing complete'),
    onError: (error) => toast.error(`Error in batch processing: ${error.message}`),
  })

  const handleReset = () => {
    setSelectedFile(null)
    setBatchFiles([])
    imageMutation.reset()
    audioMutation.reset()
    batchImageMutation.reset()
    batchAudioMutation.reset()
  }

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary flex items-center justify-center gap-3">
            <Music className="w-10 h-10" />
            Instrument Classifier
          </h1>
          <p className="text-xl text-muted-foreground">
            Identify musical instruments from images and audio recordings using AI.
          </p>
        </div>

        <Tabs defaultValue="image" className="space-y-6" onValueChange={handleReset}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="image" className="gap-2"><ImageIcon className="w-4 h-4" /> Image</TabsTrigger>
            <TabsTrigger value="audio" className="gap-2"><Music className="w-4 h-4" /> Audio</TabsTrigger>
            <TabsTrigger value="batch-image" className="gap-2"><Layers className="w-4 h-4" /> Batch Images</TabsTrigger>
            <TabsTrigger value="batch-audio" className="gap-2"><Layers className="w-4 h-4" /> Batch Audio</TabsTrigger>
          </TabsList>

          {/* Single Image Tab */}
          <TabsContent value="image" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Classify Single Image</CardTitle>
                <CardDescription>Upload an image (JPG, PNG) to identify the instrument.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedFile && !imageMutation.data ? (
                  <FileUploader
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    onFilesSelected={(files) => {
                      setSelectedFile(files[0])
                      imageMutation.mutate(files[0])
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {selectedFile && <FilePreview file={selectedFile} onRemove={handleReset} />}

                    {imageMutation.isPending && (
                      <div className="text-center py-8 text-muted-foreground animate-pulse">
                        Analyzing image...
                      </div>
                    )}

                    {imageMutation.data && (
                      <div className="space-y-4">
                        <PredictionCard result={imageMutation.data} file={selectedFile} />
                        <Button onClick={handleReset} variant="outline" className="w-full">Analyze Another</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Single Audio Tab */}
          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Classify Single Audio</CardTitle>
                <CardDescription>Upload an audio file (WAV, MP3) to identify the instrument.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedFile && !audioMutation.data ? (
                  <FileUploader
                    accept={{ 'audio/*': ['.wav', '.mp3', '.ogg'] }}
                    onFilesSelected={(files) => {
                      setSelectedFile(files[0])
                      audioMutation.mutate(files[0])
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {selectedFile && <FilePreview file={selectedFile} onRemove={handleReset} />}

                    {audioMutation.isPending && (
                      <div className="text-center py-8 text-muted-foreground animate-pulse">
                        Listening to audio...
                      </div>
                    )}

                    {audioMutation.data && (
                      <div className="space-y-4">
                        <PredictionCard result={audioMutation.data} file={selectedFile} />
                        <Button onClick={handleReset} variant="outline" className="w-full">Analyze Another</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch Image Tab */}
          <TabsContent value="batch-image" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Batch Image Classification</CardTitle>
                <CardDescription>Upload multiple images to classify them at once.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {batchFiles.length === 0 && !batchImageMutation.data ? (
                  <FileUploader
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    maxFiles={50}
                    onFilesSelected={(files) => {
                      setBatchFiles(files)
                      batchImageMutation.mutate(files)
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {batchImageMutation.isPending && (
                      <div className="text-center py-8 text-muted-foreground animate-pulse">
                        Processing {batchFiles.length} images...
                      </div>
                    )}

                    {batchImageMutation.data && (
                      <div className="space-y-4">
                        <BatchResults data={batchImageMutation.data} />
                        <Button onClick={handleReset} variant="outline" className="w-full">Process More</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch Audio Tab */}
          <TabsContent value="batch-audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Batch Audio Classification</CardTitle>
                <CardDescription>Upload multiple audio files to classify them at once.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {batchFiles.length === 0 && !batchAudioMutation.data ? (
                  <FileUploader
                    accept={{ 'audio/*': ['.wav', '.mp3', '.ogg'] }}
                    maxFiles={50}
                    onFilesSelected={(files) => {
                      setBatchFiles(files)
                      batchAudioMutation.mutate(files)
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {batchAudioMutation.isPending && (
                      <div className="text-center py-8 text-muted-foreground animate-pulse">
                        Processing {batchFiles.length} audio clips...
                      </div>
                    )}

                    {batchAudioMutation.data && (
                      <div className="space-y-4">
                        <BatchResults data={batchAudioMutation.data} />
                        <Button onClick={handleReset} variant="outline" className="w-full">Process More</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

export default App
