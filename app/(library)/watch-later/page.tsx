"use client"

import React, { useState, useEffect } from "react";
import { Layout } from "../../../components/layout/layout";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
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
} from "../../../components/ui/dialog";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
    PlayCircle,
    MoreVertical,
    Clock,
    Trash2,
    Share2,
    Download,
    ArrowUpDown,
    Shuffle,
    ListReorder,
    FilterX,
    Upload
} from "lucide-react";

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    channel: string;
    uploadedAt: string;
}

const WatchLaterPage = () => {
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState<Video[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setVideos([
                {
                    id: "1",
                    title: "Ethical Hacking Full Course - Learn Ethical Hacking in 10 Hours",
                    thumbnail: "/api/placeholder/320/180",
                    duration: "9:56:19",
                    views: "8.5M",
                    channel: "edureka!",
                    uploadedAt: "5 years ago"
                },
                {
                    id: "2",
                    title: "Android Development Tutorial in Hindi",
                    thumbnail: "/api/placeholder/320/180",
                    duration: "1:13:40",
                    views: "2.5M",
                    channel: "CodeWithHarry",
                    uploadedAt: "5 years ago"
                },
                {
                    id: "3",
                    title: "HOW TO SCORE 8+ CGPA ! ONLY DO THIS ! PRO TIP",
                    thumbnail: "/api/placeholder/320/180",
                    duration: "11:02",
                    views: "21K",
                    channel: "Ajay Raj",
                    uploadedAt: "5 years ago"
                },
                {
                    id: "4",
                    title: "Artificial Intelligence Full Course | AI Tutorial for Beginners",
                    thumbnail: "/api/placeholder/320/180",
                    duration: "4:52:51",
                    views: "3.9M",
                    channel: "edureka!",
                    uploadedAt: "5 years ago"
                }
            ]);
            setLoading(false);
        }, 2000);
    }, []);

    const handleSort = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        const sortedVideos = [...videos].sort((a, b) => {
            return newOrder === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
        setVideos(sortedVideos);
    };

    const handleShuffle = () => {
        const shuffledVideos = [...videos].sort(() => Math.random() - 0.5);
        setVideos(shuffledVideos);
    };

    const handleDelete = (video: Video) => {
        setSelectedVideo(video);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (selectedVideo) {
            setVideos(videos.filter(v => v.id !== selectedVideo.id));
            setShowDeleteDialog(false);
            setSelectedVideo(null);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[conic-gradient-from_var(--tw-gradient-stops)] from-gray-900 via-purple-900 to-violet-900">
                <ScrollArea className="h-screen">
                    <div className="max-w-7xl mx-auto p-6 pt-32">
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Watch Later</h1>
                                <p className="text-gray-400">
                                    {videos.length} videos • Updated yesterday
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant="secondary"
                                    className="flex items-center gap-2 hover:bg-blue-600"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Play all
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={handleSort}
                                >
                                    <ArrowUpDown className="w-5 h-5" />
                                    Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={handleShuffle}
                                >
                                    <Shuffle className="w-5 h-5" />
                                    Shuffle
                                </Button>
                            </div>
                        </div>

                        {/* Videos Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {loading ? (
                                [...Array(8)].map((_, i) => (
                                    <div key={i} className="space-y-3 bg-gray-800/30 rounded-lg p-3">
                                        <Skeleton className="h-[180px] w-full rounded-lg bg-gray-700/50" />
                                        <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
                                        <Skeleton className="h-4 w-1/2 bg-gray-700/50" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-4 w-1/4 bg-gray-700/50" />
                                            <Skeleton className="h-4 w-1/4 bg-gray-700/50" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                videos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="group bg-gray-800/30 rounded-lg p-3 transition-all hover:bg-gray-700/40"
                                    >
                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                                <PlayCircle className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12" />
                                            </div>
                                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                                                {video.duration}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-400">
                                                    {video.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">{video.channel}</p>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                                    <span>{video.views} views</span>
                                                    <span>•</span>
                                                    <span>{video.uploadedAt}</span>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4 text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem>
                                                        <Clock className="mr-2 h-4 w-4" /> Add to Queue
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Share2 className="mr-2 h-4 w-4" /> Share
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" /> Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() => handleDelete(video)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Remove Video</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove "{selectedVideo?.title}" from your Watch Later playlist?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Remove
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default WatchLaterPage;