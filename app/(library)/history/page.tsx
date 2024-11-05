"use client"

import React, { useState, useEffect } from 'react';
import {
    Search,
    Trash2,
    Calendar,
    Clock,
    Filter,
    MoreVertical,
    Pause,
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { Layout } from "../../../components/layout/layout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Toggle } from "../../../components/ui/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../../components/ui/tooltip";

interface Video {
    id: number;
    title: string;
    channel?: string;
    views: string;
    duration: string;
    timestamp?: string;
    thumbnail: string;
    category?: string;
    description?: string;
}

const WatchHistory = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('today');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isHistoryPaused, setIsHistoryPaused] = useState(false);
    const [selectedVideos, setSelectedVideos] = useState(new Set());

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const mockShorts: Video[] = [
        {
            id: 1,
            title: "AI ate your job",
            views: "1M views",
            duration: "0:30",
            thumbnail: "/api/placeholder/320/560",
            description: "Exploring the impact of AI on the job market"
        },
        {
            id: 2,
            title: "The chaotic marriage market",
            views: "500K views",
            duration: "0:45",
            thumbnail: "/api/placeholder/320/560",
            description: "A look into modern dating trends"
        },
        {
            id: 3,
            title: "How dare you seduce my friend",
            views: "750K views",
            duration: "0:60",
            thumbnail: "/api/placeholder/320/560",
            description: "Drama short featuring relationship dynamics"
        }
    ];

    const mockVideos: Video[] = [
        {
            id: 4,
            title: "THOR: RAGNAROK Movie Reaction! | First Time Watch!",
            channel: "CineDesi",
            views: "9.1K views",
            duration: "47:35",
            timestamp: "2 hours ago",
            thumbnail: "/api/placeholder/320/180",
            category: "Entertainment",
            description: "First-time reaction to Thor: Ragnarok"
        },
        {
            id: 5,
            title: "Foreigners react to JAWAN Part 2",
            channel: "Weltweit",
            views: "10K views",
            duration: "20:46",
            timestamp: "4 hours ago",
            thumbnail: "/api/placeholder/320/180",
            category: "Entertainment",
            description: "International reactions to Jawan movie"
        }
    ];

    const ShortsCard = ({ short }: { short: Video }) => (
        <Card className="relative group aspect-[9/16] overflow-hidden bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <img
                src={short.thumbnail}
                alt={short.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-semibold line-clamp-2">{short.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>{short.views}</span>
                    <span>•</span>
                    <span>{short.duration}</span>
                </div>
            </div>
        </Card>
    );

    const ShortsSkeleton = () => (
        <div className="aspect-[9/16] relative">
            <Skeleton className="w-full h-full rounded-xl bg-gray-800/50" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <Skeleton className="h-6 w-3/4 mb-2 bg-gray-800/50" />
                <Skeleton className="h-4 w-1/2 bg-gray-800/50" />
            </div>
        </div>
    );

    const VideoCard = ({ video }: { video: Video }) => (
        <Card className="p-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex gap-4">
                <div className="relative group">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-64 h-36 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-sm">
                        {video.duration}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>More options</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{video.channel}</p>
                    <p className="text-gray-400 text-sm">{video.views} • {video.timestamp}</p>
                    <div className="mt-2 flex gap-2">
                        <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm">
                            {video.category}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-purple-800 to-black text-white">
                <div className="max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold">Watch history</h1>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search watch history"
                                        className="pl-10 w-64 bg-gray-800/50 border-gray-700"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <Select value={selectedDate} onValueChange={setSelectedDate}>
                                    <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700">
                                        <SelectValue placeholder="Select date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="yesterday">Yesterday</SelectItem>
                                        <SelectItem value="week">This week</SelectItem>
                                        <SelectItem value="month">This month</SelectItem>
                                    </SelectContent>
                                </Select>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="bg-gray-800/50 border-gray-700">
                                            <Filter className="w-4 h-4 mr-2" />
                                            Filters
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                                        <DropdownMenuItem onClick={() => setFilterType('all')}>
                                            All types
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterType('videos')}>
                                            Videos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterType('shorts')}>
                                            Shorts
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex gap-4 items-center">
                                <Toggle
                                    pressed={isHistoryPaused}
                                    onPressedChange={setIsHistoryPaused}
                                    className="bg-gray-800/50"
                                >
                                    <Pause className="w-4 h-4 mr-2" />
                                    {isHistoryPaused ? 'Resume' : 'Pause'} history
                                </Toggle>

                                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Clear history
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-gray-800 border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle>Clear watch history?</DialogTitle>
                                            <DialogDescription>
                                                This will remove all videos from your watch history. This action cannot be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end gap-4">
                                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={() => {
                                                setShowDeleteDialog(false);
                                            }}>
                                                Clear
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12">
                        {/* Shorts Section */}
                        {(filterType === 'all' || filterType === 'shorts') && (
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Clock className="w-5 h-5" />
                                    <h2 className="text-2xl font-semibold">Shorts</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {isLoading ? (
                                        Array(4).fill(0).map((_, i) => (
                                            <ShortsSkeleton key={i} />
                                        ))
                                    ) : (
                                        mockShorts
                                            .filter(short =>
                                                short.title.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map(short => (
                                                <ShortsCard key={short.id} short={short} />
                                            ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Videos Section */}
                        {(filterType === 'all' || filterType === 'videos') && (
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Calendar className="w-5 h-5" />
                                    <h2 className="text-2xl font-semibold">Today</h2>
                                </div>
                                <div className="space-y-4">
                                    {isLoading ? (
                                        Array(3).fill(0).map((_, i) => (
                                            <Card key={i} className="p-4 bg-gray-800/50 border-gray-700">
                                                <div className="flex gap-4">
                                                    <Skeleton className="w-64 h-36 rounded-lg bg-gray-700/50" />
                                                    <div className="flex-1">
                                                        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700/50" />
                                                        <Skeleton className="h-4 w-1/2 mb-2 bg-gray-700/50" />
                                                        <Skeleton className="h-4 w-1/3 bg-gray-700/50" />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    ) : (
                                        mockVideos
                                            .filter(video =>
                                                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                (video.channel && video.channel.toLowerCase().includes(searchQuery.toLowerCase()))
                                            )
                                            .map(video => (
                                                <VideoCard key={video.id} video={video} />
                                            ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* No Results Message */}
                        {!isLoading && searchQuery &&
                            ![...mockVideos, ...mockShorts].some(
                                item =>
                                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (item.channel && item.channel.toLowerCase().includes(searchQuery.toLowerCase()))
                            ) && (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                    <p className="text-gray-400">
                                        Try different keywords or remove search filters
                                    </p>
                                </div>
                            )}

                        {/* Empty State */}
                        {!isLoading && !searchQuery && mockVideos.length === 0 && mockShorts.length === 0 && (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold mb-2">Your watch history is empty</h3>
                                <p className="text-gray-400">
                                    Videos that you watch will show up here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default WatchHistory;