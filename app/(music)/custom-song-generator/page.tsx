'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {AnimatedGenerateButton} from "@/components/ui/ai-button"
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Repeat,
    Share2,
    Heart,
    MoreHorizontal,
    Shuffle,
    ListMusic,
    Music2,
    Info
} from 'lucide-react';
import { Layout } from "../../../components/layout/layout";

interface Song {
    id: number;
    title: string;
    genres: string[];
    coverArt: string;
    audioUrl: string;
    duration: number;
    timestamp: string;
}

interface GenerateSongPayload {
    title: string;
    lyrics: string;
    genres: string[];
    isInstrumental: boolean;
}

const musicGenres: string[] = [
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz',
    'Classical', 'Electronic', 'Country', 'Folk', 'Blues',
    'Metal', 'Reggae', 'Latin', 'Indie', 'Soul',
    'Funk', 'Disco', 'House', 'Techno', 'Gospel'
];

const formatTime = (time: number | null): string => {
    if (time === null || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function SongGeneratorPage(): JSX.Element {
    // Form state
    const [title, setTitle] = useState<string>('');
    const [lyrics, setLyrics] = useState<string>('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [isInstrumental, setIsInstrumental] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Music player state
    const [generatedSongs, setGeneratedSongs] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0.7);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isRepeat, setIsRepeat] = useState<boolean>(false);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentSong: Song | null = currentSongIndex !== null ? generatedSongs[currentSongIndex] : null;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('loadedmetadata', () => {
                setDuration(audioRef.current?.duration || 0);
            });
            audioRef.current.addEventListener('timeupdate', () => {
                setCurrentTime(audioRef.current?.currentTime || 0);
            });
            audioRef.current.addEventListener('ended', handleSongEnd);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleSongEnd);
            }
        };
    }, [currentSongIndex, isRepeat, isShuffle]);

    const handleGenreSelect = (genre: string): void => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const generateSong = async (): Promise<void> => {
        if (!title.trim()) {
            setError('Please enter a song title');
            return;
        }

        if (!isInstrumental && !lyrics.trim()) {
            setError('Please enter lyrics or enable instrumental mode');
            return;
        }

        if (selectedGenres.length === 0) {
            setError('Please select at least one genre');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const payload: GenerateSongPayload = {
                title,
                lyrics: isInstrumental ? '' : lyrics,
                genres: selectedGenres,
                isInstrumental
            };

            const response = await fetch('/api/generate-song', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to generate song');

            const data = await response.json();

            const newSong: Song = {
                id: Date.now(),
                title,
                genres: selectedGenres,
                coverArt: "/api/placeholder/300/300",
                audioUrl: data.audioUrl,
                duration: 180,
                timestamp: new Date().toISOString()
            };

            setGeneratedSongs(prev => [newSong, ...prev]);
            setCurrentSongIndex(0);
            setIsPlaying(true);

            // Reset form
            setTitle('');
            setLyrics('');
            setSelectedGenres([]);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayPause = (): void => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSongEnd = (): void => {
        if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (isShuffle) {
            const nextIndex = Math.floor(Math.random() * generatedSongs.length);
            setCurrentSongIndex(nextIndex);
        } else {
            handleNext();
        }
    };

    const handleNext = (): void => {
        if (currentSongIndex !== null) {
            if (currentSongIndex < generatedSongs.length - 1) {
                setCurrentSongIndex(currentSongIndex + 1);
            } else {
                setCurrentSongIndex(0);
            }
            setIsPlaying(true);
        }
    };

    const handlePrevious = (): void => {
        if (!audioRef.current) return;

        if (currentTime > 3) {
            audioRef.current.currentTime = 0;
        } else if (currentSongIndex !== null) {
            if (currentSongIndex > 0) {
                setCurrentSongIndex(currentSongIndex - 1);
            } else {
                setCurrentSongIndex(generatedSongs.length - 1);
            }
        }
        setIsPlaying(true);
    };

    const handleTimeChange = (value: number[]): void => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const handleVolumeChange = (value: number[]): void => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    const toggleMute = (): void => {
        if (audioRef.current) {
            const newMutedState = !isMuted;
            setIsMuted(newMutedState);
            audioRef.current.volume = newMutedState ? 0 : volume;
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
                <div className="container mx-auto px-24 py-32">
                    {/* Title */}
                    <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-purple-900 to-teal-400 bg-clip-text text-transparent">
                        Custom Song Generator
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Song Generation Form */}
                        <Card className="bg-black/20 backdrop-blur">
                            <CardContent className="p-6">
                                {/* Title Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter song title"
                                        maxLength={80}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{title.length}/80</p>
                                </div>

                                {/* Genre Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Genres</label>
                                    <ScrollArea className="h-20 w-full rounded-md border p-2">
                                        <div className="flex flex-wrap gap-2">
                                            {musicGenres.map((genre) => (
                                                <Badge
                                                    key={genre}
                                                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                                                    className="cursor-pointer"
                                                    onClick={() => handleGenreSelect(genre)}
                                                >
                                                    {genre}
                                                </Badge>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Instrumental Toggle */}
                                <div className="flex items-center justify-between mb-6">
                                    <label className="text-sm font-medium">Instrumental Mode</label>
                                    <Switch
                                        checked={isInstrumental}
                                        onCheckedChange={setIsInstrumental}
                                    />
                                </div>

                                {/* Lyrics Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Lyrics</label>
                                    <Textarea
                                        value={lyrics}
                                        onChange={(e) => setLyrics(e.target.value)}
                                        placeholder="Enter lyrics or describe the song"
                                        disabled={isInstrumental}
                                        rows={6}
                                        maxLength={3000}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{lyrics.length}/3000</p>
                                </div>

                                {/* Generate Button */}
                                <AnimatedGenerateButton 
  onClick={generateSong}
  isLoading={isLoading}
/>

                                {error && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Generated Songs List */}
                        <Card className="bg-black/20 backdrop-blur">
                            <CardHeader>
                                <CardTitle>Generated Songs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[calc(100vh-400px)]">
                                    {generatedSongs.map((song, index) => (
                                        <div
                                            key={song.id}
                                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-white/5 ${currentSongIndex === index ? "bg-white/10" : ""
                                                }`}
                                            onClick={() => {
                                                setCurrentSongIndex(index);
                                                setIsPlaying(true);
                                            }}
                                        >
                                            <img
                                                src={song.coverArt}
                                                alt={song.title}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{song.title}</p>
                                                <p className="text-sm text-gray-400">
                                                    {song.genres.join(', ')}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (currentSongIndex === index) {
                                                        handlePlayPause();
                                                    } else {
                                                        setCurrentSongIndex(index);
                                                        setIsPlaying(true);
                                                    }
                                                }}
                                            >
                                                {currentSongIndex === index && isPlaying ? (
                                                    <Pause className="h-5 w-5" />
                                                ) : (
                                                    <Play className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Music Player */}
                {currentSong && (
                    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t">
                        <Progress
                            value={(currentTime / duration) * 100}
                            className="h-1"
                        />
                        <div className="p-4">
                            <div className="flex items-center gap-4">
                                {/* Song Info */}
                                <div className="flex items-center gap-4 min-w-[240px]">
                                    <img
                                        src={currentSong.coverArt}
                                        alt={currentSong.title}
                                        className="w-12 h-12 rounded"
                                    />
                                    <div>
                                        <h3 className="font-medium">{currentSong.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            {currentSong.genres.join(', ')}
                                        </p>
                                    </div>
                                </div>

                                {/* Player Controls */}
                                <div className="flex-1">
                                    <div className="flex justify-center items-center gap-4 mb-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsShuffle(!isShuffle)}
                                            className={`hover:text-white ${isShuffle ? 'text-primary' : 'text-gray-400'}`}
                                        >
                                            <Shuffle className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handlePrevious}
                                        >
                                            <SkipBack className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10"
                                            onClick={handlePlayPause}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-6 w-6" />
                                            ) : (
                                                <Play className="h-6 w-6" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleNext}
                                        >
                                            <SkipForward className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsRepeat(!isRepeat)}
                                            className={`hover:text-white ${isRepeat ? 'text-primary' : 'text-gray-400'}`}
                                        >
                                            <Repeat className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">
                                            {formatTime(currentTime)}
                                        </span>
                                        <Slider
                                            value={[currentTime]}
                                            max={duration}
                                            step={1}
                                            onValueChange={handleTimeChange}
                                            className="flex-1"
                                        />
                                        <span className="text-sm text-gray-400">
                                            {formatTime(duration)}
                                        </span>
                                    </div>
                                </div>

                                {/* Additional Controls */}
                                <div className="flex items-center gap-2 min-w-[240px] justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`hover:text-white ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                                    >
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleMute}
                                        >
                                            {isMuted ? (
                                                <VolumeX className="h-5 w-5" />
                                            ) : (
                                                <Volume2 className="h-5 w-5" />
                                            )}
                                        </Button>
                                        <Slider
                                            value={[isMuted ? 0 : volume]}
                                            max={1}
                                            step={0.01}
                                            onValueChange={handleVolumeChange}
                                            className="w-24"
                                        />
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Info className="h-5 w-5" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Song Information</DialogTitle>
                                                <DialogDescription>
                                                    <div className="space-y-2">
                                                        <p><strong>Title:</strong> {currentSong.title}</p>
                                                        <p><strong>Genres:</strong> {currentSong.genres.join(', ')}</p>
                                                        <p><strong>Generated:</strong> {new Date(currentSong.timestamp).toLocaleString()}</p>
                                                    </div>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        {/* Hidden audio element */}
                        <audio
                            ref={audioRef}
                            src={currentSong.audioUrl}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
}