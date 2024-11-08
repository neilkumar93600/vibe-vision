"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Slider } from "../../../components/ui/slider";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Toggle } from "../../../components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import {
  BookOpen,
  Video,
  Download,
  Share2,
  ThumbsUp,
  Volume2,
  Play,
  Pause,
  Maximize,
  Settings,
  Plus,
  Sparkles,
  Languages,
  Timer,
  Wand2,
  Save,
  History,
  Palette,
  Music,
  VolumeX,
  RefreshCw,
  Camera,
  Copy,
  Check,
  Moon,
  Sun,
  Heart,
  Star,
  BookOpenCheck,
  Library,
  BrainCircuit,
  Feather,
  Clock,
  Users,
  Share,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { Layout } from '@/components/layout/layout';

const genres: Genre[] = [
  {
    value: 'Fantasy',
    icon: '🧙‍♂️',
    theme: 'from-violet-600 to-indigo-600',
    description: 'Magical worlds and epic adventures'
  },
  {
    value: 'Sci-Fi',
    icon: '🚀',
    theme: 'from-cyan-500 to-blue-600',
    description: 'Futuristic technology and space exploration'
  },
  {
    value: 'Mystery',
    icon: '🔍',
    theme: 'from-slate-600 to-slate-900',
    description: 'Suspenseful investigations and puzzling cases'
  },
  {
    value: 'Romance',
    icon: '💝',
    theme: 'from-pink-500 to-rose-600',
    description: 'Love, relationships, and emotional journeys'
  },
  {
    value: 'Horror',
    icon: '👻',
    theme: 'from-gray-900 to-red-900',
    description: 'Spine-chilling tales and supernatural events'
  },
  {
    value: 'Adventure',
    icon: '🗺️',
    theme: 'from-emerald-600 to-yellow-500',
    description: 'Action-packed journeys and thrilling quests'
  },
  {
    value: 'Fairy Tale',
    icon: '🧚',
    theme: 'from-purple-500 to-pink-500',
    description: 'Enchanting stories of magic, wonder, and happy endings'
  },
  {
    value: 'Slice of Life',
    icon: '🍃',
    theme: 'from-green-400 to-blue-400',
    description: 'Everyday experiences, emotions, and personal growth'
  },
  // {
  //   value: 'Drama',
  //   icon: '🎭',
  //   theme: 'from-blue-500 to-gray-700',
  //   description: 'Emotional narratives with realistic conflicts and character depth'
  // },
  {
    value: 'Action',
    icon: '💥',
    theme: 'from-red-600 to-orange-600',
    description: 'High-energy sequences, battles, and heroism'
  }
];


export default function EnhancedStoryGenerator() {
  // Core state
  const [genre, setGenre] = useState<string>(genres[0].value);
  const [genreDescription, setGenreDescription] = useState<string>(genres[0].description);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // UI state
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState<boolean>(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('write');

  // Enhanced features state
  const [storyHistory, setStoryHistory] = useState<StoryHistoryItem[]>([]);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [backgroundStyle, setBackgroundStyle] = useState<string>('gradient');
  const [aiModel, setAiModel] = useState<string>('standard');
  const [characterLimit, setCharacterLimit] = useState<number>(2000);

  // Advanced settings
  const [settings, setSettings] = useState<StorySettings>({
    tone: 'casual',
    ageGroup: 'Kids ( less than 12 )',
    pacing: '30 seconds',
    duration: 30,
    complexity: 'medium',
  });

  // Creative features
  const [enableCharacterProfiles, setEnableCharacterProfiles] = useState<boolean>(true);
  const [generateIllustrations, setGenerateIllustrations] = useState<boolean>(false);
  const [musicTheme, setMusicTheme] = useState<string>('none');
  const [language, setLanguage] = useState<string>('English');

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);


  const [error, setError] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');

  const [localStorageInstance,  setLocalStorageInstance] = useState<Storage | null>(null)
  
  useEffect(() => {
    setLocalStorageInstance(localStorage);
  }, [])
  

  // Dynamic background classes
  const getBackgroundClass = () => {
    const baseClasses = 'transition-all duration-500 ease-in-out';
    switch (backgroundStyle) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br ${genres.find(g => g.value === genre)?.theme || 'from-purple-600 to-blue-600'}`;
      case 'animated':
        return `${baseClasses} bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900`;
      case 'particles':
        return `${baseClasses} bg-black`;
      default:
        return `${baseClasses} bg-gradient-to-br from-purple-600 to-blue-600`;
    }
  };

  const handleGenerate = async () => {
    let currentTime = Date.now();
    const token = localStorageInstance?.getItem('token');

    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/generate-video/story-time`,
        {
          prompt,
          theme: `${genre}, with ${genreDescription}`,
          tone: settings.tone,
          ageGroup: settings.ageGroup,
          duration: settings.duration * 2,
          currentTime
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setVideoUrl(`${BASE_URL}/${response.data.videoUrl}`);
      setGeneratedScript(response.data.script)
      setVideoTitle(response.data.videoName)

      console.log(response.data.data);
    } catch (error) {
      console.error('Error generating video:', error);
      setError('Failed to generate video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (videoUrl) {
      try {
        // Fetch the video file as a blob using Axios
        const response = await axios.get(videoUrl, {
          responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'roast-video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url); // Clean up the URL object
      } catch (error) {
        console.error("Error downloading video:", error);
      }
    }
  };



  // Initialize
  // useEffect(() => {
  //   // Load saved stories
  //   if (savedStories) {
  //     setStoryHistory(JSON.parse(savedStories));
  //   }

  //   // Set theme
  //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   setDarkMode(prefersDark);

  //   // Initialize audio context
  //   if (audioEnabled) {
  //     const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  //     const audioContext = new AudioContext();
  //     // Additional audio setup here
  //   }
  // }, []);

  // Utility functions
  const handleCopyToClipboard = async () => {
    if (!generatedScript) return;

    try {
      await navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      if (audioEnabled) {
        new Audio('/sounds/copy.mp3').play();
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // const handleExport = async (format: string) => {
  //   if (!generatedStory?.content) return;

  //   // Simulated export
  //   const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  //   await delay(1000);

  //   // In a real app, implement actual export logic here
  //   console.log(`Exporting in ${format} format...`);
  // };

  return (
    <Layout>
      <div
        ref={containerRef}
        className={`min-h-screen ${getBackgroundClass()} p-6 overflow-hidden relative`}
      >
        {/* Animated particles background */}
        {backgroundStyle === 'particles' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`,
                  opacity: 0.1 + Math.random() * 0.3,
                }}
              >
                <Sparkles
                  className="text-purple-500"
                  size={10 + Math.random() * 20}
                />
              </div>
            ))}
          </div>
        )}

        {/* Main content */}
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                <BrainCircuit className="h-8 w-8" />
                Story Forge AI
              </h1>
              <Badge variant="outline" className="text-white">
                v2.0
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

              {/* Audio toggle */}
              {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? (
                      <Volume2 className="h-5 w-5" />
                    ) : (
                      <VolumeX className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle sound effects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

              {/* Settings button */}
              <Button
                variant="outline"
                className="bg-black/30"
                onClick={() => setShowSettingsDialog(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </header>

          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left panel - Story controls */}
            <div className="space-y-6">
              {/* Genre selection */}
              <Card className={`${darkMode ? 'bg-black/50' : 'bg-white/90'} backdrop-blur border-purple-500/20`}>
                <CardHeader>
                  <CardTitle className="text-white">Choose Your Genre</CardTitle>
                  <CardDescription className="text-purple-200">
                    Select a genre to shape your story&apos;s world
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {genres.map(({ value, icon, description }) => (
                      <TooltipProvider key={value}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={genre === value ? "default" : "outline"}
                              className={`w-full h-20 flex flex-col items-center justify-center gap-2 ${genre === value
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "hover:bg-purple-500/20"
                                }`}
                              onClick={() => {
                                setGenre(value);
                                setGenreDescription(description)
                                if (audioEnabled) {
                                  new Audio('/sounds/select.mp3').play();
                                }
                              }
                              }>
                              <span className="text-2xl">{icon}</span>
                              <span className="text-sm">{value}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Story Configuration */}
              <Card className={`${darkMode ? 'bg-black/50' : 'bg-white/90'} backdrop-blur border-purple-500/20`}>
                <CardHeader>
                  <CardTitle className="text-white">Story Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Model Selection */}
                  {/* <div className="space-y-2">
                  <Label className="text-purple-200">AI Model</Label>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger className="bg-black/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                  {/* Story Settings Tabs */}
                  <Tabs defaultValue="tone" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-black/30">
                      <TabsTrigger value="tone">Tone</TabsTrigger>
                      <TabsTrigger value="ageGroup">Age Group</TabsTrigger>
                      <TabsTrigger value="videoDuration">Video Duration</TabsTrigger>
                      {/* <TabsTrigger value="complexity">Complexity</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="tone" className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {['Casual', 'Formal', 'Humorous', 'Dark', 'Sarcastic', 'Hilarious', 'Silly', 'Dark Comedy'].map((tone) => (
                          <Button
                            key={tone}
                            variant="outline"
                            className={`${settings.tone.toLowerCase() === tone.toLowerCase()
                              ? 'bg-purple-600'
                              : 'bg-black/30'
                              }`}
                            onClick={() => setSettings({ ...settings, tone: tone.toLowerCase() })}
                          >
                            {tone}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="ageGroup" className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {['Kids ( less than 12 )', 'Teens ( 13 to 18 )', 'Adults ( above 18 )'].map((ageGroup) => (
                          <Button
                            key={ageGroup}
                            variant="outline"
                            className={`${settings.ageGroup.toLowerCase() === ageGroup.toLowerCase()
                              ? 'bg-purple-600'
                              : 'bg-black/30'
                              }`}
                            onClick={() => setSettings({ ...settings, ageGroup: ageGroup.toLowerCase() })}
                          >
                            {ageGroup}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="videoDuration" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Video Duration (seconds)</Label>
                        <Slider
                          value={[settings.duration]}
                          onValueChange={([value]) =>
                            setSettings(prev => ({ ...prev, duration: value }))
                          }
                          max={120}
                          min={5}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-sm text-gray-300">
                          Current: About {settings.duration} seconds
                        </p>
                      </div>
                    </TabsContent>
                    {/* Similar TabsContent for style, pacing, and complexity */}
                  </Tabs>

                  {/* Advanced Features */}
                  {/* <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-200">Character Profiles</Label>
                    <Switch
                      checked={enableCharacterProfiles}
                      onCheckedChange={setEnableCharacterProfiles}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-200">AI Illustrations</Label>
                    <Switch
                      checked={generateIllustrations}
                      onCheckedChange={setGenerateIllustrations}
                    />
                  </div>
                </div> */}

                  {/* Story Prompt */}
                  <div className="space-y-2">
                    <Label className="text-purple-200">Story Prompt</Label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your story idea..."
                      className="h-32 bg-black/50 resize-none"
                      maxLength={characterLimit}
                    />
                    <div className="flex justify-between text-sm text-purple-300">
                      <span>{prompt.length} / {characterLimit} characters</span>
                      <button
                        className="hover:text-purple-100"
                        onClick={() => setPrompt('')}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Generation Button */}
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Crafting Your Story
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Story
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right panel - Story Display */}
            <div className="space-y-6">
              <Card className={`${darkMode ? 'bg-black/50' : 'bg-white/90'} backdrop-blur border-purple-500/20`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Your Story and Video
                    </CardTitle>
                    {generatedScript && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopyToClipboard}
                          className="text-white hover:bg-white/20"
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowHistoryDialog(true)}
                        className="text-white hover:bg-white/20"
                      >
                        <History className="h-4 w-4" />
                      </Button> */}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] rounded-md border border-purple-500/20 p-4">

                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-64 rounded-lg object-contain bg-black"
                        preload="auto"
                        onError={(e) => console.error("Video error:", e)}
                      />
                    ) : loading ?
                      (
                        <div className="w-full h-64 rounded-lg bg-black/30 flex flex-col items-center justify-center">
                          <div
                            className="p-2 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-20 md:h-20 h-16 w-16 aspect-square rounded-full"
                          >
                            <div
                              className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"
                            ></div>
                          </div>

                          <div className="loader">
                            <p>Generating</p>
                            <div className="words">
                              <span className="word">Story</span>
                              <span className="word">Speech</span>
                              <span className="word">Character</span>
                              <span className="word">Video</span>
                              <span className="word">Story</span>
                            </div>
                          </div>
                        </div>
                      )
                      :
                      (
                        <div className="w-full h-64 rounded-lg bg-black/30 flex items-center justify-center">
                          <p className="text-gray-400">Your video will appear here</p>
                        </div>
                      )}

                    {videoUrl && (
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        <Button
                          variant="secondary"

                          onClick={handleDownloadVideo}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setShowShareDialog(true)}
                        >
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    )}

                    {generatedScript ? (
                      <div className="prose prose-invert max-w-none py-20">
                        <h2 className="text-2xl font-bold text-purple-100 mb-4">
                          {videoTitle || 'Story Time Video'}
                        </h2>
                        <p className="text-purple-50 whitespace-pre-wrap leading-relaxed">
                          {generatedScript}
                        </p>
                        {generateIllustrations && (
                          <div className="mt-6 grid grid-cols-2 gap-4">
                            <img
                              src="/api/placeholder/400/300"
                              alt="AI Generated Illustration"
                              className="rounded-lg border border-purple-500/20"
                            />
                            <img
                              src="/api/placeholder/400/300"
                              alt="AI Generated Illustration"
                              className="rounded-lg border border-purple-500/20"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`text-center text-purple-300 py-20 ${loading && ' animate-pulse '}`}>
                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Your story will appear here</p>
                        <p className="text-sm mt-2 text-purple-400">
                          Use the controls on the left to generate your story
                        </p>
                      </div>
                    )}
                  </ScrollArea>

                  {generatedScript && (
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {/* <Button
                          variant="outline"
                          className="bg-black/30"
                          onClick={() => handleExport('pdf')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button> */}
                          <Button
                            variant="outline"
                            className="bg-black/30"
                            onClick={() => setShowShareDialog(true)}
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                        <div className="flex gap-4 items-center">
                          <Badge variant="outline" className="bg-black/30">
                            {genre}
                          </Badge>
                          {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (generatedStory) {
                              const updatedStory = {
                                ...generatedStory,
                                likes: generatedStory.likes + 1
                              };
                              setGeneratedStory(updatedStory);
                              if (audioEnabled) {
                                new Audio('/sounds/like.mp3').play();
                              }
                            }
                          }}
                          className="text-white hover:bg-white/20"
                        >
                          <Heart className={`h-4 w-4 ${generatedStory.likes > 0 ? 'fill-current' : ''}`} />
                        </Button> */}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Dialogs */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent className="bg-black/90 border-purple-500/20">
              <DialogHeader>
                <DialogTitle className="text-white">Share Your Story</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Share your creation across platforms
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Twitter', icon: '🐦' },
                  { name: 'Facebook', icon: '👤' },
                  { name: 'Reddit', icon: '🤖' },
                  { name: 'Email', icon: '📧' }
                ].map(platform => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className="w-full bg-black/30"
                    onClick={() => setShowShareDialog(false)}
                  >
                    <span className="mr-2">{platform.icon}</span>
                    {platform.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Settings Dialog */}
          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogContent className="bg-black/90 border-purple-500/20">
              <DialogHeader>
                <DialogTitle className="text-white">Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-200">Background Style</Label>
                  <Select value={backgroundStyle} onValueChange={setBackgroundStyle}>
                    <SelectTrigger className="bg-black/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Dynamic Gradient</SelectItem>
                      <SelectItem value="particles">Particle Effect</SelectItem>
                      <SelectItem value="animated">Animated Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-200">Character Limit</Label>
                  <Slider
                    value={[characterLimit]}
                    min={500}
                    max={5000}
                    step={100}
                    onValueChange={([value]) => setCharacterLimit(value)}
                  />
                  <div className="text-right text-sm text-purple-300">
                    {characterLimit.toLocaleString()} characters
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-200">Auto-save Stories</Label>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* History Dialog */}
          <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
            <DialogContent className="bg-black/90 border-purple-500/20 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-white">Story History</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {storyHistory.map((item) => (
                    <Card key={item.id} className="bg-black/50">
                      <CardHeader>
                        <CardTitle className="text-white text-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {genres.find(g => g.value === item.genre)?.icon}
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setGeneratedStory(item);
                              setPrompt(item.prompt);
                              setGenre(item.genre);
                              setShowHistoryDialog(false);
                            }}
                          >
                            Load
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-purple-100 font-semibold mb-2">{item.title}</h3>
                        <p className="text-purple-200 line-clamp-3">{item.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout >
  );
}