'use client';
import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Layout } from "../../../components/layout/layout"
import {
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/config';

type ContentItem = {
  _id: string;
  contentType: string;
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string | null;
  thumbnail_alt?: string | null;
  musicTitle?: string | null;
  displayName?: string | null;
  createdAt: string;
};

const VideoPlatform = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All', 'Gaming', 'Republic of Gamers', 'Live', 'Gaming computers',
    'Rendering', 'Podcasts', 'Reaction videos', 'Electrical Engineering',
    'Mango TV', 'AI'
  ];

  const [data, setData] = useState<ContentItem[]>([]);

  // const videos = [
  //   {
  //     id: 1,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "【Multi-SUB】Unforgettable Love 宠爱",
  //     channel: "MangoTV Shorts",
  //     views: "9.6M",
  //     timeAgo: "2 years ago",
  //     duration: "46:07",
  //     verified: true
  //   },
  //   {
  //     id: 2,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "HOLY SH*T! India Drops BOMBSHELL On Justin Trudeau",
  //     channel: "misterssunshinebaby",
  //     views: "33K",
  //     timeAgo: "5 hours ago",
  //     duration: "24:44",
  //     verified: true
  //   },
  //   {
  //     id: 3,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "Compact & Powerful 14 inches Gaming Laptop - Asus Tuf A14",
  //     channel: "Venom's Tech",
  //     views: "125K",
  //     timeAgo: "7 days ago",
  //     duration: "19:42",
  //     verified: true
  //   },
  //   {
  //     id: 1,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "【Multi-SUB】Unforgettable Love 宠爱",
  //     channel: "MangoTV Shorts",
  //     views: "9.6M",
  //     timeAgo: "2 years ago",
  //     duration: "46:07",
  //     verified: true
  //   },
  //   {
  //     id: 2,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "HOLY SH*T! India Drops BOMBSHELL On Justin Trudeau",
  //     channel: "misterssunshinebaby",
  //     views: "33K",
  //     timeAgo: "5 hours ago",
  //     duration: "24:44",
  //     verified: true
  //   },
  //   {
  //     id: 3,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "Compact & Powerful 14 inches Gaming Laptop - Asus Tuf A14",
  //     channel: "Venom's Tech",
  //     views: "125K",
  //     timeAgo: "7 days ago",
  //     duration: "19:42",
  //     verified: true
  //   },
  //   {
  //     id: 1,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "【Multi-SUB】Unforgettable Love 宠爱",
  //     channel: "MangoTV Shorts",
  //     views: "9.6M",
  //     timeAgo: "2 years ago",
  //     duration: "46:07",
  //     verified: true
  //   },
  //   {
  //     id: 2,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "HOLY SH*T! India Drops BOMBSHELL On Justin Trudeau",
  //     channel: "misterssunshinebaby",
  //     views: "33K",
  //     timeAgo: "5 hours ago",
  //     duration: "24:44",
  //     verified: true
  //   },
  //   {
  //     id: 3,
  //     thumbnail: "/api/placeholder/640/360",
  //     title: "Compact & Powerful 14 inches Gaming Laptop - Asus Tuf A14",
  //     channel: "Venom's Tech",
  //     views: "125K",
  //     timeAgo: "7 days ago",
  //     duration: "19:42",
  //     verified: true
  //   }
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/content/get-all-content`);
        console.log(response.data)
        setData(response.data);
      } catch (error) {
        console.error("Error fetching content data:", error);
      }
    };
    fetchData();
  }, [BASE_URL]);

  return (
    <Layout>
      <div className="w-full bg-background pt-24/ /pl-20">
        {/* Categories ScrollArea */}
        <ScrollArea className="w-full border-b">
          <div className="flex p-4 gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "secondary"}
                className="whitespace-nowrap"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Videos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {data.map((dataItem) => (
            <Card key={dataItem._id} className="border-0 shadow-none">
              <CardContent className="p-0">
                {/* Thumbnail Container */}
                <div className="relative">
                  <img
                    src={(dataItem.imageUrl || dataItem.thumbnail_alt) ? `${BASE_URL}/${dataItem.thumbnail_alt || dataItem.imageUrl}` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg'}
                    alt={dataItem.displayName || dataItem.musicTitle || ''}
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-sm rounded">
                    {/* {video.duration} */}
                  </div>
                </div>

                {/* Video Info */}
                <div className="mt-3 flex gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{dataItem.displayName || dataItem.musicTitle || ((dataItem.contentType === 'kids-music' || dataItem.contentType === 'jukebox') ? 'AI Generated Music' : 'AI Generated Video') }</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default VideoPlatform;