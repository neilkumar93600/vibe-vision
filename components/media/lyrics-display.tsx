'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { 
  Languages,
  MusicNote,
  Share2,
  Type,
  MinusCircle,
  PlusCircle
} from 'lucide-react';

const LyricsDisplay = ({ currentTrack, currentTime }) => {
  const [lyrics, setLyrics] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [autoScroll, setAutoScroll] = useState(true);
  const [translation, setTranslation] = useState(null);
  const scrollRef = useRef(null);

  // Mock lyrics data structure
  const sampleLyrics = [
    { time: 0, text: "♪ (Music intro)" },
    { time: 13.5, text: "Verse 1:" },
    { time: 15.2, text: "Walking down these empty streets" },
    { time: 18.7, text: "Memories of what used to be" },
    // Add more lyrics with timestamps
  ];

  useEffect(() => {
    // In a real app, fetch lyrics based on currentTrack
    setLyrics(sampleLyrics);
  }, [currentTrack]);

  useEffect(() => {
    if (!autoScroll || !currentTime) return;

    const currentLyricIndex = lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return lyric.time <= currentTime && (!nextLyric || nextLyric.time > currentTime);
    });

    if (currentLyricIndex >= 0 && scrollRef.current) {
      const element = scrollRef.current.querySelector(`[data-index="${currentLyricIndex}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, lyrics, autoScroll]);

  const toggleTranslation = async () => {
    if (translation) {
      setTranslation(null);
    } else {
      // Mock translation fetch
      const translatedLyrics = lyrics.map(lyric => ({
        ...lyric,
        translation: "Translated text would go here"
      }));
      setTranslation(translatedLyrics);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MusicNote size={20} />
          Lyrics
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
          >
            <MinusCircle size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
          >
            <PlusCircle size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTranslation}
          >
            <Languages size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
          >
            <Share2 size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea 
          ref={scrollRef}
          className="h-[500px] pr-4"
        >
          <div className="space-y-4">
            {lyrics.map((lyric, index) => (
              <div
                key={index}
                data-index={index}
                className={`transition-all duration-300 ${
                  lyric.time <= currentTime &&
                  (!lyrics[index + 1] || lyrics[index + 1].time > currentTime)
                    ? 'text-primary font-medium'
                    : 'text-gray-400'
                }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                <p>{lyric.text}</p>
                {translation && (
                  <p className="text-gray-500 mt-1 text-sm">
                    {translation[index].translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LyricsDisplay;
