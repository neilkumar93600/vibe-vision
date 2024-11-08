'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    Info,
    GuitarIcon,
    Settings,
    Music,
    Download,
    Share,
    Maximize2,
    Minimize2,
    AudioLines,
    PauseCircleIcon
} from 'lucide-react';
import { Layout } from "../../../components/layout/layout";
import { Icon } from '@radix-ui/react-select';
import axios from 'axios';
import { BASE_URL } from '@/config';
import EnhancedMusicPlayer from '@/components/media/music-player';

interface Song {
    id: string;
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
    'Pop', 'Rock', 'Hip Hop',
    'Anime', 'Lofi', 'R&B/Soul', 'Chillout', 'Holiday',
    'Children’s Music', 'Jazz', 'Classical', 'Electronic',
    'Country', 'Folk', 'Blues', 'Metal', 'Reggae', 'Latin',
    'Indie', 'Soul', 'Funk', 'Disco', 'House', 'Techno', 'Gospel'
];

const musicThemes: string[] = [
    'Love', 'Adventure', 'Fantasy', 'Fantasy/Mythology',
    'Nature', 'Celebration', 'Sadness', 'Uplifting/Positive',
    'Relaxation', 'Spiritual', 'Inspirational', 'War',
    'Space/Science Fiction', 'Epic', 'Blues'
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
    const [prompt, setPrompt] = useState<string>('');
    const [lyrics, setLyrics] = useState<string>('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedThemes, setSelectedTheme] = useState<string[]>([]);
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


    const [musicUrl, setMusicUrl] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [musicTitle, setMusicTitle] = useState<string>('');
    const [generatedLyrics, setGeneratedLyrics] = useState<string>('');

    const [isMusicPlayerFullScreen, setIsMusicPlayerFullScreen] = useState<boolean>(false)

    const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

    const playerScreenRef = useRef<HTMLDivElement>(null)

    const [localStorageInstance,  setLocalStorageInstance] = useState<Storage | null>(null)
  
    useEffect(() => {
      setLocalStorageInstance(localStorage);
    }, [])
    

    //     const alt_musicUrl = `${BASE_URL}/uploads/6729fde142e71c53dbec2d78_jukebox_1730976610659_music.mp3`
    //     const alt_imageUrl = `${BASE_URL}/uploads/6729fde142e71c53dbec2d78_jukebox_1730976610659_image.png`
    //     // const alt_imageUrl = `https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg`
    //     const alt_musicTitle = `Hello Kitty's Dream`
    //     const alt_generatedLyrics =
    //         `[Verse]
    // Hello Kitty in a dream
    // Running wild by a moonlit stream
    // Whiskers twitch in the midnight gleam
    // Heartbeats racing steam by steam
    //     [Verse 2]
    // Stars are falling from the skies
    // Adventure sparkles in her eyes
    // Every wish those lights comprise
    // Makes her spirit start to rise
    //     [Chorus]
    // Hello Kitty here to stay
    // In this fantasy parade
    // Love and laughter pave the way
    // To a dream where we'll all play
    //     [Bridge]
    // Climbing rainbows touch the stars
    // Riding comets near and far
    //     Fantasy in every bar
    // In this world you know you are
    //     [Verse 3]
    // Glitter trails where she goes
    // Music's rhythm softly flows
    // Tiny pawprints in the snow
    // Love's adventure always grows
    //     [Chorus]
    // Hello Kitty here to stay
    // In this fantasy parade
    // Love and laughter pave the way
    // To a dream where we'll all play`

    const handleGenreSelect = (genre: string): void => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleThemeSelect = (theme: string): void => {
        setSelectedTheme(prev =>
            prev.includes(theme)
                ? prev.filter(g => g !== theme)
                : [...prev, theme]
        );
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

    const playGeneratedSong = () => {

        if (!isPlaying) {
            const newSong: Song = {
                id: '',
                title: musicTitle,
                genres: selectedGenres,
                coverArt: imageUrl,
                audioUrl: musicUrl,
                duration: audioRef.current?.duration || 180,
                timestamp: new Date().toISOString()
            };

            setGeneratedSongs(prev => [newSong, ...prev]);
            setCurrentSongIndex(0)

            audioRef.current?.play()
        } else {
            audioRef.current?.pause()
        }
    }

    const handleGenerateMusic = async () => {
        const token = localStorageInstance?.getItem('token');

        if (!prompt.trim()) {
            setError('Please ensure prompt is provided.');
            return;
        }

        let currentTime = Date.now();

        const finalPrompt = `Create a ${selectedGenres} song with the theme of ${selectedThemes} not more than 1 minute long. "${prompt}". The music should capture the essence of ${selectedThemes}. Ensure that elements typical of ${selectedGenres} music, like its instruments, rhythm, and mood, are present.`;

        setError('');
        setIsLoading(true);

        const apiUrl = `${BASE_URL}/api/generate-audio/jukebox`;

        const data = {
            title: title,
            userPrompt: prompt,
            prompt: finalPrompt,
            instrumental: isInstrumental,
            currentTime: currentTime,
            contentType: "jukebox",
        };

        try {
            const response = await axios.post(
                apiUrl,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            console.log('Response data:', response.data);

            setMusicUrl(`${BASE_URL}/${response.data.musicUrl}`);
            setImageUrl(`${BASE_URL}/${response.data.imageUrl}`);
            setGeneratedLyrics(response.data.lyrics);
            setMusicTitle(response.data.songTitle);


            const newSong: Song = {
                id: '',
                title,
                genres: selectedGenres,
                coverArt: imageUrl,
                audioUrl: musicUrl,
                duration: 180,
                timestamp: new Date().toISOString()
            };


            setGeneratedSongs(prev => [newSong, ...prev]);

        } catch (error: any) {
            console.error('Error generating music:', error.response ? error.response.data : error.message);
            setError('Failed to generate music. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleTimeChange = (value: number[]): void => {
        if (audioRef.current) {
            // audioRef.current.currentTime = value[0];
            setCurrentTime(audioRef.current.currentTime);
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

    const handleDownloadAudio = async () => {
        if (musicUrl) {
            try {
                // Fetch the video file as a blob using Axios
                const response = await axios.get(musicUrl, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'audio/mp3' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${musicTitle}.mp3`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url); // Clean up the URL object
            } catch (error) {
                console.error("Error downloading video:", error);
            }
        }
    };

    const maximizeScreen = () => {
        if (playerScreenRef.current) {
            if (playerScreenRef.current.requestFullscreen) {
                playerScreenRef.current.requestFullscreen();
                setIsMusicPlayerFullScreen(true)
            } else if ((playerScreenRef.current as any).mozRequestFullScreen) { 
                (playerScreenRef.current as any).mozRequestFullScreen();
                setIsMusicPlayerFullScreen(true)
            } else if ((playerScreenRef.current as any).webkitRequestFullscreen) { 
                (playerScreenRef.current as any).webkitRequestFullscreen();
                setIsMusicPlayerFullScreen(true)
            } else if ((playerScreenRef.current as any).msRequestFullscreen) { 
                (playerScreenRef.current as any).msRequestFullscreen();
                setIsMusicPlayerFullScreen(true)
            }
        }
    };

    const minimizeScreen = () => {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsMusicPlayerFullScreen(false)
            } else if ((document as any).mozCancelFullScreen) { 
                (document as any).mozCancelFullScreen();
                setIsMusicPlayerFullScreen(false)
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
                setIsMusicPlayerFullScreen(false)
            } else if ((document as any).msExitFullscreen) { 
                (document as any).msExitFullscreen();
                setIsMusicPlayerFullScreen(false)
            }
        }
    };

    return (
        <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-24 py-32">
                {/* Title */}
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                            <Music className="h-8 w-8" />
                            Jukebox AI
                        </h1>
                        {/* <Badge variant="outline" className="text-white">
                            v2.0
                        </Badge> */}
                    </div>

                    {/* <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="bg-black/30"
                            onClick={() => setShowSettingsDialog(true)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div> */}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Song Generation Form */}
                    <Card className="bg-black/20 backdrop-blur">
                        <CardContent className="p-6">

                            {/* Prompt Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Prompt</label>
                                <div className='w-full h-28 min-h-28 p-[1px] bg-gradient-to-br from-blue-300 via-blue-500 via-40% to-purple-500 rounded-md'>
                                    <Textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Enter your prompt "
                                        maxLength={1000}
                                        className='resize-none h-full w-full outline-none bg-gradient-to-br from-gray-900 via-black to-gray-900'
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{title.length}/1000</p>
                            </div>

                            {/* Title Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Title</label>

                                <div className='w-full p-[1px] bg-gradient-to-br from-blue-300 via-blue-500 via-40% to-purple-500 rounded-md'>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter song title (optional)"
                                        maxLength={80}
                                        className='h-full w-full p-3 outline-none bg-gradient-to-br from-gray-900 via-black to-gray-900'
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{title.length}/80</p>
                            </div>

                            {/* Instrumental Toggle */}
                            <div className="flex flex-row-reverse items-center justify-end gap-4 mb-6">
                                <label className="text-sm font-medium">Is Instrumental?</label>
                                {/* <Switch
                                        checked={isInstrumental}
                                        onCheckedChange={setIsInstrumental}
                                    /> */}
                                <label
                                    className={`p-[1px] rounded-lg transition-all duration-200 ${isInstrumental
                                        ? 'bg-gradient-to-br from-blue-300 via-blue-500 via-40% to-purple-500 rounded-lg'
                                        : 'bg-transparent'
                                        }`}
                                >
                                    <div className='bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg text-gray-500'>
                                        <input
                                            type="checkbox"
                                            className="h-[1px] opacity-0 overflow-hidden absolute whitespace-nowrap w-[1px] peer"
                                            checked={isInstrumental}
                                            onChange={() => setIsInstrumental(val => !val)}
                                        />
                                        <span
                                            className="peer-checked:bg-gradient-to-br from-blue-300 via-blue-500 via-40% to-purple-500 bg-clip-text peer-checked:shadow-blue-400/10 peer-checked:text-indigo-400 peer-checked:before:border-none peer-checked:before:bg-gradient-to-br peer-checked:before:opacity-100 peer-checked:before:scale-100 peer-checked:before:content-['✔'] flex flex-col items-center justify-center w-28 h-16 max-h-12 rounded-lg shadow-lg transition-all duration-300 bg-white cursor-pointer relative before:absolute before:w-5 before:h-5 before:border-[2px] before:border-gray-500 before:rounded-full before:top-1 before:left-1 before:opacity-0 before:transition-all before:scale-0 before:text-neutral-200 before:text-base before:flex before:items-center before:justify-center hover:border-blue-400 hover:before:scale-100 hover:before:opacity-100"
                                        >
                                            <GuitarIcon className='size-10' />
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Genre Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Genres</label>

                                <div className='h-fit w-fit p-[1px] bg-gradient-to-br from-blue-300 via-blue-500 via-40% to-purple-500 rounded-md'>
                                    <ScrollArea className="h-28 hover:h-fit min-h-28 duration-500 transition-all w-full rounded-md border p-2 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                                        <div className="flex flex-wrap gap-2">
                                            {musicGenres.map((genre) => (
                                                <Badge
                                                    key={genre}
                                                    variant={selectedGenres.includes(genre) ? "tertiary" : "outline"}
                                                    className="cursor-pointer px-4 py-1"
                                                    onClick={() => handleGenreSelect(genre)}
                                                >
                                                    {genre}
                                                </Badge>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Theme</label>
                                <div className='h-fit w-fit p-[1px] bg-gradient-to-br from-blue-300 via-blue-500 via-40% to-purple-500 rounded-md'>
                                    <ScrollArea className="h-28 hover:h-fit min-h-28 duration-500 transition-all w-full rounded-md border p-2 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                                        <div className="flex flex-wrap gap-2">
                                            {musicThemes.map((theme) => (
                                                <Badge
                                                    key={theme}
                                                    variant={selectedThemes.includes(theme) ? "tertiary" : "outline"}
                                                    className="cursor-pointer px-4 py-1"
                                                    onClick={() => handleThemeSelect(theme)}
                                                >
                                                    {theme}
                                                </Badge>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>

                            {/* Lyrics Input */}
                            {/* <div className="mb-6">
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
                                </div> */}

                            {/* Generate Button */}
                            <Button
                                    size="lg"
                                    className="w-full h-14 text-lg"
                                    onClick={handleGenerateMusic}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Music className="mr-2" />
                                            Create
                                        </>
                                    )}
                                </Button>

                            {/* <Button onClick={playGeneratedSong}> Test Button </Button> */}

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
                            <CardTitle>Generated Song</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[calc(100vh-400px)]/ h-full">
                                {isLoading ?
                                    (
                                        <div className="p-4 w-full h-full gap-8 text-gray-400 flex flex-col justify-center items-center overflow-hidden">
                                            <div className="w-full h-96 rounded-3xl bg-[#0f0f0f] animate-pulse flex flex-col items-center justify-center">
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
                                                        <span className="word">Music</span>
                                                        <span className="word">Lyrics</span>
                                                        <span className="word">Verses</span>
                                                        <span className="word">Chorus</span>
                                                        <span className="word">Music</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full p-8 gap-3 h-80 rounded-3xl overflow-clip bg-[#0f0f0f] animate-pulse flex flex-col items-start justify-start">
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-20 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-64 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-72 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-64 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-72 mb-4' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-20 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-64 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-72 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-64 mb-2' />
                                                <div className='bg-gray-400/70 rounded-full min-h-3 w-72 mb-2' />
                                            </div>
                                        </div>
                                    )
                                    :
                                    (musicUrl ?
                                        <div className="p-4 w-full h-full gap-8 text-gray-400 flex flex-col justify-center items-center overflow-hidden">

                                            <div className='w-full xl:h-96 rounded-3xl flex flex-col items-center xl:flex-row gap-8'>
                                                <div
                                                    className="bg-neutral-900 w-fit h-fit flex flex-col gap-6 text-center bg-cover justify-center items-center rounded-3xl p-6">
                                                    <div className={`relative h-48 w-48 group cursor-pointer `}>
                                                        <div
                                                            style={{
                                                                backgroundImage: `url('${imageUrl}')`,
                                                                filter: "blur(14px)",
                                                                opacity: 0.5,
                                                            }}
                                                            className='top-2 left-1 z-10 group-hover:scale-105 duration-300 absolute w-48 h-48 bg-cover rounded-full' >
                                                        </div>
                                                        <div
                                                            style={{
                                                                backgroundImage: `url('${imageUrl}')`,
                                                                animation: isPlaying ? 'slowRotate 15s linear infinite' : '',
                                                            }}
                                                            className='group-hover:scale-105 relative z-20 opacity-90 duration-300 group-hover:opacity-100 w-48 h-48 flex flex-col bg-cover justify-center items-center rounded-full'>
                                                            <style>
                                                                {`
                                                                    @keyframes slowRotate {
                                                                        from {
                                                                            transform: rotate(0deg);
                                                                        }
                                                                        to {
                                                                            transform: rotate(360deg);
                                                                        }
                                                                    }
                                                                `}
                                                            </style>
                                                            <div className='size-12 bg-neutral-900/60 flex justify-center items-center rounded-full backdrop-blur' >
                                                                {isPlaying && <AudioLines />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-full items-center justify-center flex flex-col gap-2">
                                                        <h3 className="text-white text-lg">{`${musicTitle}`}</h3>
                                                        <p className="text-gray-200 text-sm">Vibe Vision Music.</p>
                                                        <div onClick={playGeneratedSong} className='p-2 cursor-pointer hover:scale-105 duration-300'>
                                                            {!isPlaying ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                                                </svg>
                                                                :
                                                                <PauseCircleIcon className='size-10' />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="gap-8 flex flex-col w-full xl:h-96">
                                                    <Button
                                                        className='w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-3xl'
                                                        onClick={handleDownloadAudio}
                                                    >
                                                        <Download className="size-4" />
                                                        Download
                                                    </Button>
                                                    <Button
                                                        className='w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-3xl'
                                                        onClick={() => setShowShareDialog(true)}
                                                    >
                                                        <Share className="size-4" />
                                                        Share
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="p-8 w-full bg-gradient-to-br max-h-80 overflow-auto from-neutral-950 via-gray-950 to-indigo-950 rounded-3xl">
                                                <h3 className="font-semibold text-lg mb-2">Lyrics</h3>
                                                <p className="whitespace-pre-wrap text-gray-400">{generatedLyrics || "Nothing to show here yet"}</p>
                                            </div>
                                        </div>

                                        :
                                        <div className='w-full h-96 flex justify-center items-center'>
                                            Your Song will be shown here
                                        </div>
                                    )
                                }
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>


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

            {/* Music Player */}
            <EnhancedMusicPlayer currentSong={currentSong || null}  />
        </div >
        </Layout>
    );
}
