// app/lofi/page.tsx
"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../components/ui/dialog"
import {
  Alert,
  AlertDescription,
} from "../../../components/ui/alert"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import { Switch } from "../../../components/ui/switch"
import { Slider } from "../../../components/ui/slider"
import { Label } from "../../../components/ui/label"
import { Separator } from "../../../components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip"
import {
  ArrowLeft,
  Play,
  Pause,
  Upload,
  Settings2,
  Save,
  RefreshCw,
  Wand2,
  Music2,
  Timer,
} from "lucide-react"
import { Toast } from "../../../components/ui/toast"
import { Layout } from '../../../components/layout/layout';

// Effect presets configuration
const EffectPresets = {
  CLASSIC_LOFI: {
    name: 'Classic LoFi',
    settings: {
      tempo: 85,
      filterFreq: 2000,
      reverbMix: 0.3,
      bitDepth: 12,
      vinylNoise: -25,
      compression: -15,
      wobble: 0.2,
      saturation: 0.3
    }
  },
  VINYL_HEAVY: {
    name: 'Vinyl Heavy',
    settings: {
      tempo: 80,
      filterFreq: 1800,
      reverbMix: 0.4,
      bitDepth: 10,
      vinylNoise: -15,
      compression: -20,
      wobble: 0.4,
      saturation: 0.5
    }
  },
  TAPE_WARM: {
    name: 'Tape Warmth',
    settings: {
      tempo: 90,
      filterFreq: 2200,
      reverbMix: 0.25,
      bitDepth: 14,
      vinylNoise: -30,
      compression: -12,
      wobble: 0.15,
      saturation: 0.6
    }
  },
  SYNTHWAVE: {
    name: 'Synthwave',
    settings: {
      tempo: 95,
      filterFreq: 2500,
      reverbMix: 0.5,
      bitDepth: 16,
      vinylNoise: -35,
      compression: -10,
      wobble: 0.1,
      saturation: 0.4
    }
  }
}

// Waveform visualization component
const WaveformVisualizer = ({ audioBuffer, isPlaying, currentTime }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const data = audioBuffer.getChannelData(0)
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const width = canvas.width
      const height = canvas.height
      const amp = height / 2
      
      // Background
      ctx.fillStyle = 'hsl(var(--muted))'
      ctx.fillRect(0, 0, width, height)

      // Waveform
      ctx.beginPath()
      ctx.lineWidth = 2

      const step = Math.ceil(data.length / width)
      const playbackPosition = (currentTime * audioBuffer.sampleRate) / step

      for (let i = 0; i < width; i++) {
        let min = 1.0
        let max = -1.0
        
        for (let j = 0; j < step; j++) {
          const datum = data[(i * step) + j] || 0
          if (datum < min) min = datum
          if (datum > max) max = datum
        }

        ctx.strokeStyle = i < playbackPosition ? 
          'hsl(var(--primary))' : 
          'hsl(var(--secondary))'

        ctx.moveTo(i, (1 + min) * amp)
        ctx.lineTo(i, (1 + max) * amp)
        ctx.stroke()
      }
    }

    if (isPlaying) {
      const animate = () => {
        draw()
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      draw()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [audioBuffer, isPlaying, currentTime])

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-32 rounded-md bg-muted"
    />
  )
}

// Main component
export default function LoFiPage() {
  const router = useRouter()
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [file, setFile] = useState(null)
  const [audioBuffer, setAudioBuffer] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [settings, setSettings] = useState(EffectPresets.CLASSIC_LOFI.settings)

  const audioContextRef = useRef(null)
  const audioSourceRef = useRef(null)

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
    }
  }, [])

  // Handle time updates
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  // File upload handler
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files?.[0]
    if (!uploadedFile) return

    setLoading(true)
    setFile(uploadedFile)
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer()
      const decodedBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      
      setAudioBuffer(decodedBuffer)
      setDuration(decodedBuffer.duration)
      
      if (autoPlay) {
        handlePlayPause()
      }
      
      toast({
        title: "Success",
        description: "Audio file loaded successfully!",
      })
    } catch (error) {
      console.error('Error loading file:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load audio file",
      })
    } finally {
      setLoading(false)
    }
  }

  // Play/Pause handler
  const handlePlayPause = async () => {
    if (!audioBuffer) return

    if (isPlaying) {
      audioSourceRef.current?.stop()
      setIsPlaying(false)
      setCurrentTime(0)
    } else {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      source.start(0, currentTime)
      audioSourceRef.current = source
      setIsPlaying(true)
    }
  }

  // Apply preset
  const handlePresetChange = (preset) => {
    setSettings(EffectPresets[preset].settings)
    toast({
      title: "Preset Applied",
      description: `Applied ${EffectPresets[preset].name} preset`,
    })
  }

  // Export handler
  const handleExport = async () => {
    if (!audioBuffer) return
    
    setLoading(true)
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success",
        description: "Audio exported successfully!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export audio",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/20 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold">LoFi Converter</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-play">Auto Play</Label>
            <Switch
              id="auto-play"
              checked={autoPlay}
              onCheckedChange={setAutoPlay}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Audio */}
          <Card className="bg-card/50 backdrop-blur border-muted">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Original Track</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPresets(true)}
                    >
                      <Wand2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Effect Presets</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center">
                  <input
                    accept="audio/*"
                    className="hidden"
                    id="audio-file"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="audio-file">
                    <Button
                      variant="outline"
                      className="mb-4"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Audio
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: MP3, WAV
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Music2 className="h-5 w-5" />
                    <span>{file.name}</span>
                  </div>
                  
                  <WaveformVisualizer 
                    audioBuffer={audioBuffer}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                  />
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      <span className="text-sm">
                        {Math.floor(currentTime)}s / {Math.floor(duration)}s
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-card/50 backdrop-blur border-muted">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>LoFi Settings</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
              >
                <Settings2 className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              {loading && <Progress value={33} className="mb-4" />}

              {file && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Filter Frequency</Label>
                      <Slider
                        value={[settings.filterFreq]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, filterFreq: value }))
                        }
                        min={200}
                        max={4000}
                        step={100}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">200Hz</span>
                        <span className="text-sm">4kHz</span>
                      </div>
                    </div>

                    <div>
                      <Label>Vinyl Noise</Label>
                      <Slider
                        value={[settings.vinylNoise]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, vinylNoise: value }))
                        }
                        min={-40}
                        max={0}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">-40dB</span>
                        <span className="text-sm">0dB</span>
                      </div>
                    </div>

                    <div>
                      <Label>Saturation</Label>
                      <Slider
                        value={[settings.saturation]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, saturation: value }))
                        }
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">0</span>
                        <span className="text-sm">Max</span>
                      </div>
                    </div>

                    <div>
                      <Label>Wobble</Label>
                      <Slider
                        value={[settings.wobble]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, wobble: value }))
                        }
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">0</span>
                        <span className="text-sm">Max</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setSettings(EffectPresets.CLASSIC_LOFI.settings)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button
                      onClick={handleExport}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Presets Dialog */}
        <Dialog open={showPresets} onOpenChange={setShowPresets}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Effect Presets</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              {Object.entries(EffectPresets).map(([key, preset]) => (
                <Card
                  key={key}
                  className="bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
                  onClick={() => {
                    handlePresetChange(key)
                    setShowPresets(false)
                  }}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{preset.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Filter: {preset.settings.filterFreq}Hz | 
                      Noise: {preset.settings.vinylNoise}dB |
                      Wobble: {preset.settings.wobble}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Advanced Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Advanced Settings</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Tempo</Label>
                  <Slider
                    value={[settings.tempo]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({ ...prev, tempo: value }))
                    }
                    min={60}
                    max={120}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm">60 BPM</span>
                    <span className="text-sm">120 BPM</span>
                  </div>
                </div>

                <div>
                  <Label>Reverb Mix</Label>
                  <Slider
                    value={[settings.reverbMix]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({ ...prev, reverbMix: value }))
                    }
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm">Dry</span>
                    <span className="text-sm">Wet</span>
                  </div>
                </div>

                <div>
                  <Label>Bit Depth</Label>
                  <Slider
                    value={[settings.bitDepth]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({ ...prev, bitDepth: value }))
                    }
                    min={1}
                    max={16}
                    step={1}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm">1-bit</span>
                    <span className="text-sm">16-bit</span>
                  </div>
                </div>

                <div>
                  <Label>Compression</Label>
                  <Slider
                    value={[settings.compression]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({ ...prev, compression: value }))
                    }
                    min={-30}
                    max={0}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm">-30dB</span>
                    <span className="text-sm">0dB</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </Layout>
  )
}