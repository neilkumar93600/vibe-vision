// File: app/(main)/comedy-lab/components/ComedyStudioPlatform.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Play, Volume2, VolumeX, Share2, Download, MessageCircle, Heart, Mic, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { LampContainer } from "../../../components/ui/lamp";
import { Progress } from '../../../components/ui/progress';
import { Badge } from "../../../components/ui/badge";
import { Layout } from "../../../components/layout/layout"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ComedyStudioPlatform = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const router = useRouter();
  
  const features = [
    {
      title: 'Roast My Pic!',
      description: 'Tell VibeVision AI to roast an Image you submit!',
        icon: <Play className="w-8 h-8" />,
        gradient: 'from-purple-500 to-pink-500',
        path: '/15-reel',
        bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"
    },
    // {
    //   title: 'Comedy Script',
    //   description: 'Write hilarious scripts with AI suggestions',
    //     icon: <Mic className="w-8 h-8" />,
    //     gradient: 'from-blue-500 to-teal-500',
    //     path: '/comedy-script',
    //     bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17l-7-7h14l-7 7z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
    // },
    {
      title: 'Story Forge AI',
      description: 'Generate unique comedy storylines with AI',
        icon: <Sparkles className="w-8 h-8" />,
        gradient: 'from-orange-500 to-red-500',
        path: '/story-generation',
        bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 0h16a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm0 2v16h16V2H2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
    },
    // {
    //   title: 'Caption Generator',
    //   description: 'Create witty captions for your content',
    //     icon: <MessageCircle className="w-8 h-8" />,
    //     gradient: 'from-green-500 to-emerald-500',
    //     path: '/caption-generator',
    //     bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L10 10zm10 10L20 20V0zM0 20h20L10 10z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
    // }
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
        <section className='py-12 px-6 lg:px-16'>
          <h2 className="text-3xl font-bold mb-6">Create with AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {features.map((feature, index) => (
                  <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.2 }
                      }}
                      className="cursor-pointer"
                      onClick={() => router.push(feature.path)}
                  >
                      <Card
                          className={`relative overflow-hidden h-[300px] bg-gradient-to-br ${feature.gradient}`}
                      >
                          <div
                              className="absolute inset-0 opacity-10"
                              style={{ backgroundImage: feature.bgPattern }}
                          />
                          <CardContent className="p-6 flex flex-col items-center justify-center h-full text-white relative z-10">
                              <motion.div
                                  whileHover={{ rotate: 360, scale: 1.2 }}
                                  transition={{ duration: 0.5 }}
                                  className="mb-6 p-4 bg-white/10 rounded-full"
                              >
                                  {feature.icon}
                              </motion.div>
                              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                              <p className="text-sm text-center text-white/90 mb-4">{feature.description}</p>
                              <div className="absolute bottom-4 left-4">
                                  <Badge variant="secondary" className="bg-white/20">
                                      AI-Powered
                                  </Badge>
                              </div>
                          </CardContent>
                      </Card>
                  </motion.div>
              ))}
          </div>
        </section>

        {/* Tutorial Videos Section */}
        <section className="container mx-auto py-16 hidden">
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
        <section className="container mx-auto py-16 hidden">
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
        <section className="container mx-auto py-16 hidden">
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