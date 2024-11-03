// File: app/(main)/comedy-lab/components/ComedyStudioPlatform.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Play, Volume2, VolumeX, Share2, Download, MessageCircle, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { LampContainer } from "../../../components/ui/lamp";
import { Progress } from '../../../components/ui/progress';
import { Layout } from "../../../components/layout/layout"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ComedyStudioPlatform = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // Sample data for features
  const features = [
    {
      id: 1,
      title: '15-Reel Format',
      description: 'Create engaging 15-second comedy reels with AI assistance',
      icon: <Play className="w-6 h-6" />
    },
    {
      id: 2,
      title: 'Story Generation',
      description: 'Generate unique comedy storylines with AI',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      id: 3,
      title: 'Comedy Script',
      description: 'Write hilarious scripts with AI suggestions',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      id: 4,
      title: 'Caption Generator',
      description: 'Create witty captions for your content',
      icon: <MessageCircle className="w-6 h-6" />
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        {/* Hero Section */}
        <LampContainer>
          <section className="container mx-auto py-20 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mt-8"
            >
              Comedy Studio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mt-8"
            >
              Turn your ideas into comedy gold with AI-powered tools
            </motion.p>
          </section>
        </LampContainer>

        {/* Features Section */}
        <section className="container mx-auto py-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-purple-800/50 border-purple-600">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-purple-200">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tutorial Videos Section */}
        <section className="container mx-auto py-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Tutorial Videos</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            className="tutorial-swiper"
          >
            {[1, 2, 3, 4, 5].map((video) => (
              <SwiperSlide key={video}>
                <motion.div
                  className="relative aspect-video bg-purple-800/30 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={`/api/placeholder/400/225`}
                    alt={`Tutorial ${video}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 15-Reel Section */}
        <section className="container mx-auto py-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Trending Reels</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            navigation
            pagination={{ clickable: true }}
            className="reel-swiper"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((reel) => (
              <SwiperSlide key={reel}>
                <motion.div
                  key={reel}
                  className="relative aspect-[9/16] bg-purple-800/30 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={`/api/placeholder/300/533`}
                    alt={`Reel ${reel}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between mb-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress value={33} className="h-1" />
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Comedy Shows Section */}
        <section className="container mx-auto py-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Popular Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((show) => (
              <motion.div
                key={show}
                className="relative aspect-video bg-purple-800/30 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={`/api/placeholder/400/225`}
                  alt={`Show ${show}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between mb-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-white">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={45} className="h-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ComedyStudioPlatform;