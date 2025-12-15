import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUploader, FilePreview } from "@/components/file-uploader";
import { PredictionCard } from "@/components/prediction-result";
import { BatchResults } from "@/components/batch-results";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  PredictionSkeleton,
  AudioPredictionSkeleton,
  BatchResultsSkeleton,
} from "@/components/loading-skeleton";
import {
  useImageClassifier,
  useAudioClassifier,
  useBatchImageClassifier,
  useBatchAudioClassifier,
} from "@/hooks/useClassifier";
import { Music, ImageIcon, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

function App() {
  // Use custom hooks for each classifier type
  const imageClassifier = useImageClassifier();
  const audioClassifier = useAudioClassifier();
  const batchImageClassifier = useBatchImageClassifier();
  const batchAudioClassifier = useBatchAudioClassifier();

  const handleTabChange = () => {
    imageClassifier.reset();
    audioClassifier.reset();
    batchImageClassifier.reset();
    batchAudioClassifier.reset();
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <ThemeToggle />

      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary flex items-center justify-center gap-3">
            <Music className="w-10 h-10" aria-hidden="true" />
            Instrument Classifier
          </h1>
          <p className="text-xl text-muted-foreground">
            Identify musical instruments from images and audio recordings using
            AI.
          </p>
        </header>

        <main>
          <Tabs
            defaultValue="image"
            className="space-y-6"
            onValueChange={handleTabChange}
          >
            <TabsList
              className="grid w-full grid-cols-4"
              aria-label="Classification modes"
            >
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Image</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-2">
                <Music className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger value="batch-image" className="gap-2">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Batch Images</span>
              </TabsTrigger>
              <TabsTrigger value="batch-audio" className="gap-2">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Batch Audio</span>
              </TabsTrigger>
            </TabsList>

            {/* Single Image Tab */}
            <TabsContent value="image" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Classify Single Image</CardTitle>
                  <CardDescription>
                    Upload an image (JPG, PNG, WebP) to identify the instrument.
                    Max 10MB.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {imageClassifier.isError && (
                    <Alert variant="destructive">
                      <AlertDescription className="flex items-center justify-between">
                        <span>Failed to process image. Please try again.</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={imageClassifier.retry}
                          className="gap-2"
                        >
                          <RefreshCw className="w-4 h-4" /> Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {imageClassifier.result ? (
                    <div className="space-y-4">
                      <PredictionCard
                        result={imageClassifier.result}
                        file={imageClassifier.selectedFile}
                        className="max-w-md mx-auto mt-6"
                      />
                      <Button
                        onClick={imageClassifier.reset}
                        variant="outline"
                        className="w-full max-w-md mx-auto block"
                      >
                        Analyze Another
                      </Button>
                    </div>
                  ) : imageClassifier.isPending ? (
                    <div className="space-y-6">
                      {imageClassifier.selectedFile && (
                        <FilePreview
                          file={imageClassifier.selectedFile}
                          viewMode="large"
                        />
                      )}
                      <PredictionSkeleton />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {!imageClassifier.selectedFile && (
                        <FileUploader
                          accept={{
                            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                          }}
                          onFilesSelected={(files) =>
                            imageClassifier.classify(files[0])
                          }
                          showPreview
                        />
                      )}
                      {imageClassifier.selectedFile && (
                        <FilePreview
                          file={imageClassifier.selectedFile}
                          onRemove={imageClassifier.reset}
                          viewMode="large"
                        />
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
                  <CardDescription>
                    Upload an audio file (WAV, MP3, OGG) to identify the
                    instrument. Max 10MB.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {audioClassifier.isError && (
                    <Alert variant="destructive">
                      <AlertDescription className="flex items-center justify-between">
                        <span>Failed to process audio. Please try again.</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={audioClassifier.retry}
                          className="gap-2"
                        >
                          <RefreshCw className="w-4 h-4" /> Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {audioClassifier.result ? (
                    <div className="space-y-4">
                      <PredictionCard
                        result={audioClassifier.result}
                        file={audioClassifier.selectedFile}
                        className="max-w-md mx-auto mt-6"
                      />
                      <Button
                        onClick={audioClassifier.reset}
                        variant="outline"
                        className="w-full max-w-md mx-auto block"
                      >
                        Analyze Another
                      </Button>
                    </div>
                  ) : audioClassifier.isPending ? (
                    <div className="space-y-6">
                      {audioClassifier.selectedFile && (
                        <FilePreview
                          file={audioClassifier.selectedFile}
                          viewMode="large"
                        />
                      )}
                      <AudioPredictionSkeleton />
                    </div>
                  ) : (
                    <FileUploader
                      accept={{ "audio/*": [".wav", ".mp3", ".ogg"] }}
                      onFilesSelected={(files) =>
                        audioClassifier.classify(files[0])
                      }
                      showPreview
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Batch Image Tab */}
            <TabsContent value="batch-image" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Batch Image Classification</CardTitle>
                  <CardDescription>
                    Upload multiple images to classify them at once. Max 50
                    files, 10MB each.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {batchImageClassifier.isError && (
                    <Alert variant="destructive">
                      <AlertDescription className="flex items-center justify-between">
                        <span>Batch processing failed. Please try again.</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={batchImageClassifier.retry}
                          className="gap-2"
                        >
                          <RefreshCw className="w-4 h-4" /> Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {batchImageClassifier.result ? (
                    <div className="space-y-4">
                      <BatchResults
                        data={batchImageClassifier.result}
                        files={batchImageClassifier.files}
                      />
                      <Button
                        onClick={batchImageClassifier.reset}
                        variant="outline"
                        className="w-full"
                      >
                        Process More
                      </Button>
                    </div>
                  ) : batchImageClassifier.isPending ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-4 justify-center">
                        {batchImageClassifier.files.map((file, i) => (
                          <FilePreview key={i} file={file} viewMode="grid" />
                        ))}
                      </div>
                      <BatchResultsSkeleton
                        count={Math.min(batchImageClassifier.files.length, 4)}
                      />
                    </div>
                  ) : batchImageClassifier.files.length === 0 ? (
                    <FileUploader
                      accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                      maxFiles={50}
                      onFilesSelected={batchImageClassifier.classify}
                      showPreview
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4 justify-center">
                        {batchImageClassifier.files.map((file, i) => (
                          <FilePreview
                            key={i}
                            file={file}
                            viewMode="grid"
                            onRemove={() => batchImageClassifier.removeFile(i)}
                          />
                        ))}
                      </div>
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
                  <CardDescription>
                    Upload multiple audio files to classify them at once. Max 50
                    files, 10MB each.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {batchAudioClassifier.isError && (
                    <Alert variant="destructive">
                      <AlertDescription className="flex items-center justify-between">
                        <span>Batch processing failed. Please try again.</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={batchAudioClassifier.retry}
                          className="gap-2"
                        >
                          <RefreshCw className="w-4 h-4" /> Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {batchAudioClassifier.result ? (
                    <div className="space-y-4">
                      <BatchResults
                        data={batchAudioClassifier.result}
                        files={batchAudioClassifier.files}
                      />
                      <Button
                        onClick={batchAudioClassifier.reset}
                        variant="outline"
                        className="w-full"
                      >
                        Process More
                      </Button>
                    </div>
                  ) : batchAudioClassifier.isPending ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {batchAudioClassifier.files.map((file, i) => (
                          <FilePreview key={i} file={file} viewMode="list" />
                        ))}
                      </div>
                      <BatchResultsSkeleton
                        count={Math.min(batchAudioClassifier.files.length, 4)}
                      />
                    </div>
                  ) : batchAudioClassifier.files.length === 0 ? (
                    <FileUploader
                      accept={{ "audio/*": [".wav", ".mp3", ".ogg"] }}
                      maxFiles={50}
                      onFilesSelected={batchAudioClassifier.classify}
                      showPreview
                    />
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {batchAudioClassifier.files.map((file, i) => (
                        <FilePreview
                          key={i}
                          file={file}
                          viewMode="list"
                          onRemove={() => batchAudioClassifier.removeFile(i)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default App;
