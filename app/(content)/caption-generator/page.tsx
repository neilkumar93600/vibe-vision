"use client";

import React, { useState, useRef } from 'react';
import { FileUpload } from "../../../components/ui/file-upload";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "../../../components/ui/select";
import { Slider } from "../../../components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { 
  CloudIcon, 
  RefreshCcw,
  Copy,
  Tag,
  HelpCircle,
  Wand2,
  Share2,
  Trash2,
  Camera,
  Settings2,
  Palette,
  Type
} from "lucide-react";

interface Platform {
  maxLength: number;
  hashtagLimit: number;
}

interface Platforms {
  [key: string]: Platform;
}

interface ToneOption {
  value: string;
  label: string;
  icon: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const platforms: Platforms = {
  instagram: { maxLength: 2200, hashtagLimit: 30 },
  twitter: { maxLength: 280, hashtagLimit: 5 },
  facebook: { maxLength: 63206, hashtagLimit: 10 },
  linkedin: { maxLength: 3000, hashtagLimit: 15 }
};

const toneOptions: ToneOption[] = [
  { value: 'professional', label: 'Professional', icon: '👔' },
  { value: 'casual', label: 'Casual', icon: '😊' },
  { value: 'humorous', label: 'Humorous', icon: '😄' },
  { value: 'formal', label: 'Formal', icon: '📜' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'inspirational', label: 'Inspirational', icon: '✨' },
  { value: 'technical', label: 'Technical', icon: '💻' },
  { value: 'storytelling', label: 'Storytelling', icon: '📚' }
];

export default function CaptionGenerator() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [hashtagCount, setHashtagCount] = useState<number>(5);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [selectedPlatform, setPlatform] = useState<string>('instagram');
  const [captionLength, setCaptionLength] = useState<string>('medium');
  const [colorScheme, setColorScheme] = useState<string>('default');
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result as string);
          setImage(file);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCaptions = [
        "Sample caption 1 #awesome",
        "Sample caption 2 #cool",
        "Sample caption 3 #nice"
      ];
      
      setGeneratedCaptions(mockCaptions);
      await generateHashtags();
      
      toast({
        title: "Success",
        description: "Content generated successfully!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Error generating content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHashtags = async () => {
    try {
      // Simulated API call - replace with actual API endpoint
      const mockHashtags = ['awesome', 'photography', 'lifestyle', 'trending', 'viral'];
      setGeneratedHashtags(mockHashtags);
    } catch (error) {
      console.error('Error generating hashtags:', error);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageUrl('');
    setTone('');
    setDescription('');
    setGeneratedCaptions([]);
    setGeneratedHashtags([]);
  };

  const handleCopyContent = (content: string | null, type: 'caption' | 'hashtags' = 'caption') => {
    const hashtagString = generatedHashtags
      .slice(0, hashtagCount)
      .map(tag => `#${tag}`)
      .join(' ');
    
    const fullContent = type === 'caption' && content
      ? `${content}\n\n${hashtagString}`
      : hashtagString;

    navigator.clipboard.writeText(fullContent);
    toast({
      title: "Copied!",
      description: `${type === 'caption' ? 'Caption' : 'Hashtags'} copied to clipboard!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-900/20 to-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center">
          AI Caption Generator
          <Wand2 className="ml-2 text-purple-400" />
        </h1>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload />
        </div>

        {/* Controls Section */}
        <Card className="mb-8">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={selectedPlatform}
                onValueChange={(value) => setPlatform(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(platforms).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select
                value={tone}
                onValueChange={(value) => setTone(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Context (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any specific details or context you'd like to include..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Hashtags</Label>
              <Slider
                value={[hashtagCount]}
                onValueChange={(value) => setHashtagCount(value[0])}
                min={5}
                max={platforms[selectedPlatform].hashtagLimit}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>5</span>
                <span>{platforms[selectedPlatform].hashtagLimit}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <Dialog open={openSettings} onOpenChange={setOpenSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    Advanced Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Caption Length</Label>
                      <RadioGroup
                        value={captionLength}
                        onValueChange={setCaptionLength}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="short" id="short" />
                          <Label htmlFor="short">Short</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="long" id="long" />
                          <Label htmlFor="long">Long</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={generateContent}
                disabled={!image || !tone || loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {(generatedCaptions.length > 0 || generatedHashtags.length > 0) && (
          <div className="space-y-6">
            <Tabs defaultValue="captions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="captions">Captions</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="captions" className="space-y-4">
                {generatedCaptions.map((caption, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <p className="mb-4">{caption}</p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyContent(caption)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Share functionality
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="hashtags">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {generatedHashtags.slice(0, hashtagCount).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleCopyContent(`#${tag}`, 'hashtags')}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleCopyContent(null, 'hashtags')}
                      className="w-full gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy All Hashtags
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Quick Actions */}
        <div className="fixed bottom-8 right-8 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setOpenSettings(true)}
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Customize Appearance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    const root = document.documentElement;
                    const currentSize = getComputedStyle(root).fontSize;
                    root.style.fontSize = currentSize === '16px' ? '18px' : '16px';
                  }}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust Text Size</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Platform Tips Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-purple-400" />
              Platform Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {selectedPlatform === 'instagram' && 
                'For maximum engagement on Instagram, use a mix of popular and niche hashtags. Consider adding hashtags in the first comment rather than the caption.'}
              {selectedPlatform === 'twitter' && 
                'Twitter posts with 1-2 relevant hashtags tend to get more engagement than those with more. Place hashtags within the natural flow of your tweet when possible.'}
              {selectedPlatform === 'facebook' && 
                'Facebook posts perform best with minimal hashtag usage. Focus on 1-2 highly relevant hashtags that align with your content.'}
              {selectedPlatform === 'linkedin' && 
                'Use 3-5 relevant industry hashtags on LinkedIn. Include both broad industry terms and specific niche hashtags for better reach.'}
            </p>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  const content = generatedCaptions.join('\n\n') + '\n\n' +
                    generatedHashtags.slice(0, hashtagCount).map(tag => `#${tag}`).join(' ');
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'social-media-content.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "Success",
                    description: "Content saved as text file!",
                  });
                }}
              >
                <CloudIcon className="h-4 w-4" />
                Save as Text File
              </Button>
              
              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  const content = generatedCaptions[0] + '\n\n' +
                    generatedHashtags.slice(0, hashtagCount).map(tag => `#${tag}`).join(' ');
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: 'Generated Social Media Content',
                        text: content,
                      });
                      toast({
                        title: "Success",
                        description: "Content shared successfully!",
                      });
                    } else {
                      toast({
                        title: "Warning",
                        description: "Sharing is not supported on this device/browser",
                        variant: "default",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Error sharing content",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                Share Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
