"use client";

import { useVideoPlayer } from "@/hooks/use-video-player";
import { VideoOverlay } from "./video-overlay";
import { VideoControls } from "./video-controls";
import { InteractionButtons } from "./interaction-buttons";
import { VideoInfo } from "./video-info";
import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  channelName: string;
  channelAvatar: string;
}

export function VideoPlayer({ 
  videoUrl, 
  title, 
  channelName, 
  channelAvatar 
}: VideoPlayerProps) {
  const {
    videoRef,
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    changeVolume,
    toggleMute,
    toggleFullScreen,
    likes,
    dislikes,
    handleLike,
    handleDislike
  } = useVideoPlayer();

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleVolumeChange = (value: number[]) => {
    changeVolume(value[0]);
  };

  return (
    <div className={`
      relative w-full h-full 
      ${isFullscreen ? 'absolute inset-0 bg-black' : 'aspect-9/16'}
    `}>
      <div className={`
        w-full h-full flex items-center justify-center
        ${isFullscreen ? 'max-w-full max-h-full' : ''}
      `}>
        <video
          ref={videoRef}
          className={`
            ${isFullscreen 
              ? 'max-w-full max-h-full object-contain' 
              : 'w-full h-full object-cover'}
          `}
          loop
          playsInline
          onClick={togglePlay}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <VideoOverlay isPlaying={isPlaying} onTogglePlay={togglePlay} />
      <VideoControls 
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onToggleFullScreen={toggleFullScreen}
      />
      <InteractionButtons 
        likes={likes}
        dislikes={dislikes}
        comments="0"
        videoUrl={videoUrl}
        onLike={handleLike}
        onDislike={handleDislike}
      />
      <VideoInfo 
        title={title}
        channelName={channelName}
        channelAvatar={channelAvatar}
      />
    </div>
  );
}