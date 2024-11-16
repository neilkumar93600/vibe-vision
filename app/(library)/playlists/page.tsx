"use client"
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlayCircle,
  Clock,
  Eye,
  Search,
  Bookmark,
  ChevronRight,
  List,
  Folder,
  Tags
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from '@/components/layout/layout';
import { Badge } from "@/components/ui/badge";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  userName: string;
  userAvatar: string;
  category: string;
  savedAt: string;
}

const categories = [
  "All",
  "Machine Learning",
  "Neural Networks",
  "Computer Vision",
  "NLP",
  "Robotics",
  "Ethics in AI"
];

const PlaylistsPage = () => {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userInfo, setUserInfo] = useState({ name: "AI Enthusiast", savedCount: 0 });

  useEffect(() => {
    const loadPlaylists = () => {
      // Load user playlists
      const savedPlaylists = localStorage.getItem('aiPlaylists');
      const userPlaylists = savedPlaylists ? JSON.parse(savedPlaylists) : getDefaultPlaylists();

      // Load user info
      const savedUserInfo = localStorage.getItem('userInfo');
      const userInfoData = savedUserInfo ? JSON.parse(savedUserInfo) : {
        name: "AI Enthusiast",
        savedCount: userPlaylists.length
      };

      setPlaylists(userPlaylists);
      setUserInfo(userInfoData);
      setLoading(false);
    };

    setTimeout(loadPlaylists, 1000);
  }, []);

  const getDefaultPlaylists = (): Video[] => {
    const defaultPlaylists = [
      {
        id: "1",
        title: "Advanced AI Model Training Techniques 2024",
        description: "Learn the latest approaches to training large language models with efficient computing resources and optimal parameter tuning.",
        thumbnail: "/api/placeholder/320/180",
        duration: "45:30",
        views: "1.2M",
        userName: "AIResearcher",
        userAvatar: "/api/placeholder/32/32",
        category: "Machine Learning",
        savedAt: "2024-03-15"
      },
      {
        id: "2",
        title: "Neural Network Architecture Design",
        description: "Deep dive into designing scalable and efficient neural network architectures for modern AI applications.",
        thumbnail: "/api/placeholder/320/180",
        duration: "38:15",
        views: "892K",
        userName: "TechInnovator",
        userAvatar: "/api/placeholder/32/32",
        category: "Neural Networks",
        savedAt: "2024-03-14"
      },
      {
        id: "3",
        title: "Computer Vision: Advanced Object Detection",
        description: "Master the latest techniques in object detection and recognition using deep learning models.",
        thumbnail: "/api/placeholder/320/180",
        duration: "52:20",
        views: "2.1M",
        userName: "FutureAI",
        userAvatar: "/api/placeholder/32/32",
        category: "Computer Vision",
        savedAt: "2024-03-13"
      }
    ];

    localStorage.setItem('aiPlaylists', JSON.stringify(defaultPlaylists));
    return defaultPlaylists;
  };

  const filteredPlaylists = playlists.filter(video =>
    (selectedCategory === "All" || video.category === selectedCategory) &&
    (video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {/* Header Section */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <List className="w-8 h-8 text-purple-400" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
                  AI Platlist
                </h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search AI content..."
                    className="pl-10 pr-4 py-2 w-80 bg-white/5 rounded-full border border-white/10 focus:outline-none focus:border-purple-500 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Bookmark className="h-5 w-5 text-purple-400" />
                  <span className="text-white">{userInfo.savedCount} saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-all ${selectedCategory === category
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="p-0">
                    <Skeleton className="h-[180px] w-full rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredPlaylists.map((video) => (
                <Card
                  key={video.id}
                  className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-purple-500/80 text-white">
                          {video.category}
                        </Badge>
                      </div>
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="rounded-t-lg object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-16 h-16" />
                        </div>
                        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                          <span className="bg-black/80 text-white text-sm px-2 py-1 rounded-full flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {video.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={video.userAvatar}
                            alt={video.userName}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-gray-400 text-sm">{video.userName}</span>
                        </div>
                        <span className="text-gray-400 text-sm flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {video.views}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlaylistsPage;