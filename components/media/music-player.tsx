'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Share2,
  Download,
  Heart,
  MoreHorizontal,
  Shuffle,
  ListMusic,
  Clock,
  Radio,
  Music2,
  MusicIcon,
  Info
} from 'lucide-react';

const formatTime = (time) => {
  if (time === null || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const defaultPlaylist = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "The Cosmic Band",
    album: "Stellar Journeys",
    duration: 245,
    coverArt: "/api/placeholder/300/300"
  },
  {
    id: 2,
    title: "Neon Lights",
    artist: "Electronic Minds",
    album: "Digital Era",
    duration: 198,
    coverArt: "/api/placeholder/300/300"
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Nature Sounds",
    album: "Peaceful Moments",
    duration: 324,
    coverArt: "/api/placeholder/300/300"
  }
];

export default function EnhancedMusicPlayer() {
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playlist] = useState(defaultPlaylist);
  const [isRadioMode, setIsRadioMode] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const audioRef = useRef(null);
  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });
      audioRef.current.addEventListener('ended', handleSongEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleSongEnd);
      }
    };
  }, [currentSongIndex, isRepeat, isShuffle]);

  const handleSongEnd = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentSongIndex(nextIndex);
    } else {
      handleNext();
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(prev => prev + 1);
    } else {
      setCurrentSongIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else if (currentSongIndex > 0) {
      setCurrentSongIndex(prev => prev - 1);
    } else {
      setCurrentSongIndex(playlist.length - 1);
    }
    setIsPlaying(true);
  };

  const handleTimeChange = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <Card className="rounded-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-3">
          <audio ref={audioRef} src="/path-to-your-audio.mp3" />
          
          <div className="flex items-center gap-4">
            {/* Album Art and Song Info */}
            <div className="flex items-center gap-4 min-w-[240px]">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer group">
                    <img
                      src={currentSong.coverArt}
                      alt={currentSong.title}
                      className="w-full h-full object-cover transition group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Info className="text-white" size={24} />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Now Playing</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col items-center gap-4 mt-4">
                        <img
                          src={currentSong.coverArt}
                          alt={currentSong.title}
                          className="w-48 h-48 rounded-lg object-cover"
                        />
                        <div className="text-center">
                          <h3 className="text-xl font-semibold">{currentSong.title}</h3>
                          <p className="text-muted-foreground">{currentSong.artist}</p>
                          <p className="text-sm text-muted-foreground">{currentSong.album}</p>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              
              <div className="flex flex-col">
                <h3 className="font-semibold">{currentSong.title}</h3>
                <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={isShuffle ? "text-primary" : ""}
                >
                  <Shuffle size={20} />
                </Button>
                
                <Button variant="ghost" size="icon" onClick={handlePrevious}>
                  <SkipBack size={20} />
                </Button>
                
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                
                <Button variant="ghost" size="icon" onClick={handleNext}>
                  <SkipForward size={20} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={isRepeat ? "text-primary" : ""}
                >
                  <Repeat size={20} />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleTimeChange}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 min-w-[260px] justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRadioMode(!isRadioMode)}
                className={isRadioMode ? "text-primary" : ""}
              >
                <Radio size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
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
                    <ListMusic size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Playlist</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    {playlist.map((song, index) => (
                      <div
                        key={song.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted ${
                          currentSongIndex === index ? "bg-muted" : ""
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
                          <p className="text-sm text-muted-foreground">
                            {song.artist}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(song.duration)}
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {}}>
                    <Download size={16} className="mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>
                    <Share2 size={16} className="mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowLyrics(!showLyrics)}>
                    <MusicIcon size={16} className="mr-2" />
                    View Lyrics
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Info size={16} className="mr-2" />
                    Song Info
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress bar at the very top */}
          <Progress
            value={(currentTime / duration) * 100}
            className="h-1 absolute top-0 left-0 right-0"
          />
        </CardContent>
      </Card>
    </div>
  );
}
