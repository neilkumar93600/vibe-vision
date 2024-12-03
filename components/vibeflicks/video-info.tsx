"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VideoInfoProps {
  title: string;
  channelName: string;
  channelAvatar: string;
}

export function VideoInfo({ title, channelName, channelAvatar }: VideoInfoProps) {
  return (
    <div className="absolute bottom-4 left-4 right-16">
      <h2 className="text-white text-lg font-semibold mb-2">{title}</h2>
      <div className="flex items-center gap-2">
        <Image
          src={channelAvatar}
          alt={channelName}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-white font-medium">@{channelName}</span>
        <Button variant="secondary" size="sm" className="ml-auto">
          Subscribe
        </Button>
      </div>
    </div>
  );
}