'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import axios from 'axios';
import { cn } from "../../../lib/utils";

// shadcn/ui components
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Slider } from "../../../components/ui/slider";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Progress } from "../../../components/ui/progress";
import { Label } from "../../../components/ui/label";

// Lucide Icons
import {
  Trash2,
  Download,
  Share,
  Upload,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  RefreshCw,
  Settings,
  HelpCircle
} from 'lucide-react';

// FFmpeg Configuration
const ffmpeg = new FFmpeg();
const BASE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';

// Voice Configuration
const VOICE_OPTIONS = [
    { value: 'alloy', label: 'Alloy', description: 'Versatile and balanced voice' },
    { value: 'echo', label: 'Echo', description: 'Warm and precise voice' },
    { value: 'fable', label: 'Fable', description: 'Expressive and dynamic voice' },
    { value: 'onyx', label: 'Onyx', description: 'Deep and resonant voice' },
    { value: 'nova', label: 'Nova', description: 'Youthful and bright voice' }
];

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_ROAST_DURATION = 15; // seconds

export default function RoastVideoCreator() {
    // State Management
    const [imageFile, setImageFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedVoice, setSelectedVoice] = useState('alloy');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [roastScript, setRoastScript] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'default' });
    const [settings, setSettings] = useState({
        duration: DEFAULT_ROAST_DURATION,
        subtitleColor: '#ffffff',
        subtitleSize: 24,
        roastStyle: 'funny'
    });

    // FFmpeg Initialization
    useEffect(() => {
        const loadFFmpeg = async () => {
            try {
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
                setFfmpegLoaded(true);
                showAlert('Video processor initialized successfully', 'success');
            } catch (error) {
                console.error('FFmpeg initialization error:', error);
                showAlert('Failed to initialize video processor', 'destructive');
            }
        };
        loadFFmpeg();
    }, []);

    // File Upload Handler
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0];
            if (error.code === 'file-too-large') {
                showAlert(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, 'destructive');
            } else if (error.code === 'file-invalid-type') {
                showAlert('Invalid file type. Please upload an image file', 'destructive');
            }
            return;
        }

        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageFile({
                    url: e.target.result,
                    file: file,
                    name: file.name
                });
                showAlert('Image uploaded successfully', 'success');
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': SUPPORTED_FORMATS
        },
        maxSize: MAX_FILE_SIZE,
        multiple: false
    });

    // Alert Handler
    const showAlert = (message, variant = 'default') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: 'default' }), 3000);
    };

    // Video Generation Process
    const analyzeImageAndGenerateRoast = async () => {
        if (!imageFile || !ffmpegLoaded) return;

        setIsLoading(true);
        setProgress(0);

        try {
            // Step 1: Analyze image and generate roast
            setStatusMessage('Analyzing image...');
            const imageAnalysisResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4-vision-preview',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a ${settings.roastStyle} roast comedian. Create a ${settings.roastStyle} roast based on the image provided.`
                        },
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `Create a ${settings.duration}-second roast that matches this style: ${settings.roastStyle}`
                                },
                                {
                                    type: 'image_url',
                                    image_url: { url: imageFile.url }
                                }
                            ]
                        }
                    ],
                    max_tokens: 500
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedScript = imageAnalysisResponse.data.choices[0].message.content;
            setRoastScript(generatedScript);
            setProgress(30);

            // Step 2: Generate Audio
            setStatusMessage('Generating audio...');
            const audioResponse = await axios.post(
                'https://api.openai.com/v1/audio/speech',
                {
                    model: 'tts-1',
                    voice: selectedVoice,
                    input: generatedScript
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'blob'
                }
            );

            const audioBlob = new Blob([audioResponse.data], { type: 'audio/mpeg' });
            setAudioBlob(audioBlob);
            setProgress(60);

            // Step 3: Generate Video
            await generateVideo(audioBlob, generatedScript);
            setProgress(100);
            showAlert('Video generated successfully!', 'success');

        } catch (error) {
            console.error('Error in video generation:', error);
            showAlert('Error: ' + error.message, 'destructive');
        } finally {
            setIsLoading(false);
            setStatusMessage('');
        }
    };

    // Video Generation Helper Functions
    const generateSRT = (text) => {
        const words = text.split(' ');
        let srt = '';
        let index = 1;
        let currentTime = 0;
        const wordsPerLine = Math.ceil(words.length / (settings.duration / 3));

        for (let i = 0; i < words.length; i += wordsPerLine) {
            const line = words.slice(i, i + wordsPerLine).join(' ');
            const duration = settings.duration / (Math.ceil(words.length / wordsPerLine));

            const startTime = formatSRTTime(currentTime);
            currentTime += duration;
            const endTime = formatSRTTime(currentTime);

            srt += `${index}\n${startTime} --> ${endTime}\n${line}\n\n`;
            index++;
        }

        return srt;
    };

    const formatSRTTime = (seconds) => {
        const pad = (num) => num.toString().padStart(2, '0');
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${ms.toString().padStart(3, '0')}`;
    };

    const generateVideo = async (audioBlob, script) => {
        try {
            setStatusMessage('Preparing video components...');

            // Convert files to ArrayBuffer
            const imageArrayBuffer = await imageFile.file.arrayBuffer();
            const audioArrayBuffer = await audioBlob.arrayBuffer();

            // Write files to FFmpeg virtual filesystem
            await ffmpeg.writeFile('input.jpg', new Uint8Array(imageArrayBuffer));
            await ffmpeg.writeFile('audio.mp3', new Uint8Array(audioArrayBuffer));

            // Generate and write subtitles
            const subtitles = generateSRT(script);
            await ffmpeg.writeFile('subtitles.srt', subtitles);

            setStatusMessage('Generating video...');

            // FFmpeg command for video generation
            await ffmpeg.exec([
                '-loop', '1',
                '-i', 'input.jpg',
                '-i', 'audio.mp3',
                '-vf', `subtitles=subtitles.srt:force_style='FontSize=${settings.subtitleSize},FontColor=${settings.subtitleColor},Alignment=10,BorderStyle=3,Outline=1,Shadow=0',
                        scale=1080:-1, pad=1080:1920:(ow-iw)/2:(oh-ih)/2`,
                '-c:v', 'libx264',
                '-tune', 'stillimage',
                '-c:a', 'aac',
                '-b:a', '192k',
                '-pix_fmt', 'yuv420p',
                '-shortest',
                '-t', `${settings.duration}`,
                'output.mp4'
            ]);

            const data = await ffmpeg.readFile('output.mp4');
            const videoBlob = new Blob([data], { type: 'video/mp4' });
            setVideoUrl(URL.createObjectURL(videoBlob));
        } catch (error) {
            throw new Error('Failed to generate video: ' + error.message);
        }
    };

    // UI Event Handlers
    const handleDeleteImage = () => {
        setImageFile(null);
        setRoastScript('');
        setAudioBlob(null);
        setVideoUrl('');
        showAlert('Content cleared', 'default');
    };

    const handleDownloadVideo = () => {
        if (videoUrl) {
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = 'roast-video.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-purple-800 p-6 md:p-16">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        15-Second Roast Video Creator
                    </h1>
                    <p className="text-xl text-gray-300">
                        Upload an image and let AI create a hilarious roast video!
                    </p>
                </div>

                {/* Main Content */}
                <Card className="bg-black/20 backdrop-blur-lg border-gray-800">
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Side - Upload Form */}
                            <div className="space-y-4">
                                {/* Upload Area */}
                                <div className="relative">
                                    {isLoading && (
                                        <Progress value={progress} className="absolute top-0 z-10" />
                                    )}
                                    
                                    {imageFile ? (
                                        <div className="relative">
                                            <img
                                                src={imageFile.url}
                                                alt="Uploaded content"
                                                className="w-full h-48 object-contain rounded-lg"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={handleDeleteImage}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            {...getRootProps()}
                                            className={cn(
                                                "h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer",
                                                "transition-colors hover:border-primary",
                                                isDragActive ? "border-primary bg-primary/10" : "border-gray-700"
                                            )}
                                        >
                                            <input {...getInputProps()} />
                                            <Upload className="h-12 w-12 text-gray-500 mb-4" />
                                            <p className="text-gray-400">
                                                {isDragActive ? "Drop your image here" : "Drag & drop or click to upload"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Voice Selection */}
                                <div className="space-y-2">
                                    <Label>Voice</Label>
                                    <Select
                                        value={selectedVoice}
                                        onValueChange={(value) => setSelectedVoice(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a voice" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {VOICE_OPTIONS.map((voice) => (
                                                <SelectItem key={voice.value} value={voice.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{voice.label}</span>
                                                        <HelpCircle className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Settings Button */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setSettingsDialogOpen(true)}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Advanced Settings
                                </Button>
                            </div>

                            {/* Right Side - Video Preview and Controls */}
                            <div className="space-y-4">
                                {/* Video Preview */}
                                {videoUrl ? (
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="w-full h-64 rounded-lg object-contain bg-black"
                                    />
                                ) : (
                                    <div className="w-full h-64 rounded-lg bg-black/30 flex items-center justify-center">
                                        <p className="text-gray-400">Your roast video will appear here</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        className="w-full"
                                        onClick={analyzeImageAndGenerateRoast}
                                        disabled={!imageFile || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Generate Roast Video
                                            </>
                                        )}
                                    </Button>

                                    {videoUrl && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="secondary"
                                                onClick={handleDownloadVideo}
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => setShareDialogOpen(true)}
                                            >
                                                <Share className="mr-2 h-4 w-4" />
                                                Share
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Status Message */}
                                {statusMessage && (
                                    <Alert>
                                        <AlertDescription>{statusMessage}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Generated Script Display */}
                                {roastScript && (
                                    <Card className="bg-black/20">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Generated Script:</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-300">{roastScript}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Dialog */}
                <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Advanced Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label>Video Duration (seconds)</Label>
                                <Slider
                                    value={[settings.duration]}
                                    onValueChange={([value]) => 
                                        setSettings(prev => ({ ...prev, duration: value }))
                                    }
                                    max={30}
                                    min={5}
                                    step={1}
                                    className="w-full"
                                />
                                <p className="text-sm text-gray-500">
                                    Current: {settings.duration} seconds
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Roast Style</Label>
                                <Select
                                    value={settings.roastStyle}
                                    onValueChange={(value) => 
                                        setSettings(prev => ({ ...prev, roastStyle: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="funny">Funny</SelectItem>
                                        <SelectItem value="witty">Witty</SelectItem>
                                        <SelectItem value="sarcastic">Sarcastic</SelectItem>
                                        <SelectItem value="playful">Playful</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setSettingsDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Share Dialog */}
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Share Video</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center gap-4 py-4">
                            <Button variant="outline" size="icon" onClick={() => 
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${videoUrl}`)
                            }>
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() =>
                                window.open(`https://twitter.com/intent/tweet?url=${videoUrl}`)
                            }>
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() =>
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${videoUrl}`)
                            }>
                                <Linkedin className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() =>
                                window.open(`https://wa.me/?text=${encodeURIComponent(videoUrl)}`)
                            }>
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setShareDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Alert */}
                {alert.show && (
                    <Alert
                        variant={alert.variant}
                        className="fixed bottom-4 left-4 max-w-md animate-in fade-in slide-in-from-bottom-4"
                    >
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}