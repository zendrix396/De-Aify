'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload, Download, Zap, Shield, Image as ImageIcon, Menu, X } from 'lucide-react'
import Image from 'next/image'
import SpotlightCard from '@/components/SpotlightCard'
import { processImage, checkApiHealth } from '@/lib/api'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [iterations, setIterations] = useState([2])
  const [intensity, setIntensity] = useState([1.0])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setProcessedUrl(null)
    }
  }

  const handleProcessImage = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)

    try {
      // Check API health first
      await checkApiHealth()

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const blob = await processImage({
        file: selectedFile,
        iterations: iterations[0],
        intensity: intensity[0],
      })

      clearInterval(progressInterval)
      setProgress(100)

      const url = URL.createObjectURL(blob)
      setProcessedUrl(url)
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleDownload = () => {
    if (processedUrl && selectedFile) {
      const link = document.createElement('a')
      link.href = processedUrl
      
      // Get the original filename without extension
      const originalName = selectedFile.name
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
      const extension = originalName.substring(originalName.lastIndexOf('.')) || '.png'
      
      // Create new filename with deaified_ prefix
      link.download = `deaified_${nameWithoutExt}${extension}`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <header className="relative z-20 flex justify-center p-6">
        <nav className="flex items-center justify-between gap-6 rounded-full bg-neutral-900/80 p-3 px-6 text-base font-medium text-neutral-400 backdrop-blur-lg border border-white/10">
            {/* Logo */}
            <div className="flex items-center gap-3 pl-3">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                De-AIfy
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-neutral-300 hover:text-primary transition-colors duration-300 cursor-pointer px-3 py-2 rounded-lg">
                    How it works
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-white/20 bg-black/50 backdrop-blur-lg p-0 overflow-hidden">
                    <div className="p-6 space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">How De-AIfy Works</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Advanced image processing to bypass AI detection systems
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-300 mt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Advanced Filtering Algorithms</h4>
                            <p>Applies sophisticated image processing techniques that modify pixel patterns while preserving visual quality.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Subtle Noise Patterns</h4>
                            <p>Introduces carefully calibrated noise that disrupts AI detection signatures without affecting human perception.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Quality Preservation</h4>
                            <p>Maintains 95-98% of original image quality while significantly reducing AI detectability.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Bypass Detection Systems</h4>
                            <p>Specifically designed to fool AI detection systems like SightEngine, reducing detection rates from 100% to 2-5%.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-neutral-300 hover:text-primary transition-colors duration-300 cursor-pointer px-3 py-2 rounded-lg">
                    Privacy
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-white/20 bg-black/50 backdrop-blur-lg p-0 overflow-hidden">
                    <div className="p-6 space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Privacy & Security</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Your privacy is our priority - no images are stored
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-300 mt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">No Image Storage</h4>
                            <p>Your images are processed in real-time and immediately discarded. We never store, save, or keep any copies of your uploaded images.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Temporary Processing</h4>
                            <p>Images exist in server memory only during processing (typically 1-5 seconds) and are automatically cleared when processing completes.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">No Data Collection</h4>
                            <p>We don&apos;t collect, analyze, or store any metadata about your images. No EXIF data, filenames, or image content is retained.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Secure Processing</h4>
                            <p>All image processing happens on secure servers with encrypted connections (HTTPS). Your images are never transmitted to third parties.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-neutral-300 hover:text-primary transition-colors duration-300 cursor-pointer px-3 py-2 rounded-lg">
                    Contact
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-white/20 bg-black/50 backdrop-blur-lg p-0 overflow-hidden">
                    <div className="p-6 space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Contact</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Connect with me on social media
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-300 mt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                          <a 
                            href="https://github.com/zendrix396" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:text-primary transition-colors duration-300 cursor-pointer flex items-center gap-2"
                          >
                            <span className="font-semibold">GitHub</span>
                            <span className="text-gray-400">- Follow my projects</span>
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                          <a 
                            href="https://twitter.com/zendrix396" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:text-primary transition-colors duration-300 cursor-pointer flex items-center gap-2"
                          >
                            <span className="font-semibold">Twitter</span>
                            <span className="text-gray-400">- Stay updated</span>
                          </a>
                        </div>
                      </div>
                    </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-neutral-300 hover:text-primary transition-colors duration-300 cursor-pointer p-2 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="relative z-10 md:hidden px-6">
          <div className="flex flex-col gap-3 bg-neutral-900/90 backdrop-blur-lg border border-white/10 p-5 rounded-2xl">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-neutral-300 hover:text-primary justify-start transition-colors duration-300 cursor-pointer px-3 py-2 rounded-lg w-full text-left">
                    How it works
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-white/20 bg-black/50 backdrop-blur-lg p-0 overflow-hidden">
                    <div className="p-6 space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">How De-AIfy Works</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Advanced image processing to bypass AI detection systems
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-300 mt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Advanced Filtering Algorithms</h4>
                            <p>Applies sophisticated image processing techniques that modify pixel patterns while preserving visual quality.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Subtle Noise Patterns</h4>
                            <p>Introduces carefully calibrated noise that disrupts AI detection signatures without affecting human perception.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Quality Preservation</h4>
                            <p>Maintains 95-98% of original image quality while significantly reducing AI detectability.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Bypass Detection Systems</h4>
                            <p>Specifically designed to fool AI detection systems like SightEngine, reducing detection rates from 100% to 2-5%.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-neutral-300 hover:text-primary justify-start transition-colors duration-300 cursor-pointer px-3 py-2 rounded-lg w-full text-left">
                    Privacy
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-white/20 bg-black/50 backdrop-blur-lg p-0 overflow-hidden">
                    <div className="p-6 space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Privacy & Security</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Your privacy is our priority - no images are stored
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-300 mt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">No Image Storage</h4>
                            <p>Your images are processed in real-time and immediately discarded. We never store, save, or keep any copies of your uploaded images.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Temporary Processing</h4>
                            <p>Images exist in server memory only during processing (typically 1-5 seconds) and are automatically cleared when processing completes.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">No Data Collection</h4>
                            <p>We don&apos;t collect, analyze, or store any metadata about your images. No EXIF data, filenames, or image content is retained.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">Secure Processing</h4>
                            <p>All image processing happens on secure servers with encrypted connections (HTTPS). Your images are never transmitted to third parties.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-neutral-300 hover:text-primary justify-start transition-colors duration-300 cursor-pointer px-3 py-2 rounded-lg w-full text-left">
                    Contact
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-white/20 bg-black/50 backdrop-blur-lg p-0 overflow-hidden">
                    <div className="p-6 space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Contact</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Connect with me on social media
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-300 mt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                          <a 
                            href="https://github.com/zendrix396" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:text-primary transition-colors duration-300 cursor-pointer flex items-center gap-2"
                          >
                            <span className="font-semibold">GitHub</span>
                            <span className="text-gray-400">- Follow my projects</span>
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                          <a 
                            href="https://twitter.com/zendrix396" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:text-primary transition-colors duration-300 cursor-pointer flex items-center gap-2"
                          >
                            <span className="font-semibold">Twitter</span>
                            <span className="text-gray-400">- Stay updated</span>
                          </a>
                        </div>
                      </div>
                    </div>
                </DialogContent>
              </Dialog>
            </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 mt-4">
            <h1 className="text-5xl p-4 font-bold bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent mb-4">
              Transform AI Images
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto">
              Bypass AI detection algorithms while maintaining image quality. 
              Make your AI-generated images undetectable.
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload and Controls */}
          <div className="space-y-6">
            {/* File Upload */}
            <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.25)">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <Upload className="h-5 w-5" />
                    Upload Image
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Select an AI-generated image to process
                  </p>
                </div>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="space-y-2">
          <Image
                        src={previewUrl}
                        alt="Preview"
                        width={400}
                        height={192}
                        className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
                        unoptimized
                      />
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </SpotlightCard>

            {/* Processing Controls */}
            {previewUrl && (
              <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.25)">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Processing Settings</h3>
                    <p className="text-gray-400 text-sm">
                      Adjust the intensity and iterations for optimal results
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iterations" className="text-white font-medium">
                      Iterations: {iterations[0]}
                    </Label>
                    <Slider
                      id="iterations"
                      min={1}
                      max={10}
                      step={1}
                      value={iterations}
                      onValueChange={setIterations}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      More iterations = better results but slower processing
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intensity" className="text-white font-medium">
                      Intensity: {intensity[0].toFixed(1)}
                    </Label>
                    <Slider
                      id="intensity"
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      value={intensity}
                      onValueChange={setIntensity}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Higher intensity = more aggressive processing
                    </p>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Processing Progress</Label>
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-muted-foreground">
                        Processing your image... {progress}%
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleProcessImage}
                    disabled={!selectedFile || isProcessing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        De-AIfy Image
                      </>
                    )}
                  </button>
                </div>
              </SpotlightCard>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.25)">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <ImageIcon className="h-5 w-5" />
                    Results
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Your processed image
                  </p>
                </div>
                
                {processedUrl ? (
                  <div className="space-y-4">
                    {/* Animated Image Transition */}
                    <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-700">
                      {/* Original Image */}
          <Image
                        src={previewUrl || ''}
                        alt="Original"
                        fill
                        className={`object-cover transition-all duration-1000 ease-in-out ${
                          processedUrl ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                        }`}
                        unoptimized
                      />
                      
                      {/* Processed Image */}
          <Image
                        src={processedUrl}
                        alt="Processed"
                        fill
                        className={`object-cover transition-all duration-1000 ease-in-out delay-300 ${
                          processedUrl ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                        unoptimized
                      />
                    </div>
                    
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download De-AIfy&apos;d Image
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-500" />
                    <p className="text-gray-400">Upload and process an image to see results</p>
                  </div>
                )}
              </div>
            </SpotlightCard>

          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
