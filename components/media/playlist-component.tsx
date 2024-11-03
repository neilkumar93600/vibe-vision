import React from 'react';
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Play, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const PlaylistItem = ({ song, onPlay, isActive }) => {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/10 transition-colors ${isActive ? 'bg-gray-100/5' : ''}`}>
      <div className="relative w-12 h-12 rounded overflow-hidden">
        <img
          src={song.coverArt}
          alt={song.title}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 transition-opacity"
          onClick={() => onPlay(song)}
        >
          <Play size={20} className="text-white" />
        </Button>
      </div>

      <div className="flex-1">
        <h4 className="font-medium">{song.title}</h4>
        <p className="text-sm text-gray-400">{song.artist}</p>
      </div>

      <div className="text-sm text-gray-400">{song.duration}</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Add to Queue</DropdownMenuItem>
          <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Download</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Playlist = () => {
  const playlistSongs = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "The Cosmic Band",
      album: "Stellar Journeys",
      duration: "3:45",
      coverArt: "/api/placeholder/300/300"
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Luna Eclipse",
      album: "Natural Sounds",
      duration: "4:20",
      coverArt: "/api/placeholder/300/300"
    },
    {
      id: 3,
      title: "Mountain High",
      artist: "The Wanderers",
      album: "Adventure Calls",
      duration: "3:55",
      coverArt: "/api/placeholder/300/300"
    },
    // Add more songs as needed
  ];

  const handlePlay = (song) => {
    // Implement play functionality
    console.log('Playing:', song.title);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Playlist</h2>
          <Button>
            <Play size={16} className="mr-2" />
            Play All
          </Button>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {playlistSongs.map((song) => (
              <PlaylistItem
                key={song.id}
                song={song}
                onPlay={handlePlay}
                isActive={song.id === 1}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Playlist;
