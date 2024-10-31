// components/layout/Sidebar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import {
  Home,
  Music2,
  Mic2,
  Tv,
  Radio,
  Clock,
  ListVideo,
  PlayCircle,
  Star,
  History,
  Heart,
  Download,
  Upload,
  Youtube,
  Podcast,
  Ticket
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Music2, label: "Music Studio", href: "/music" },
  { icon: Mic2, label: "Comedy Lab", href: "/comedy" },
  { icon: Tv, label: "Entertainment Hub", href: "/entertainment" },
  { icon: Radio, label: "24/7 Show", href: "/live" },
]

const libraryItems = [
  { icon: ListVideo, label: "Your Playlists", href: "/playlists" },
  { icon: Clock, label: "Watch Later", href: "/watch-later" },
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Heart, label: "Liked Content", href: "/liked" },
  { icon: History, label: "History", href: "/history" },
]

const exploreItems = [
  { icon: Youtube, label: "Trending", href: "/trending" },
  { icon: Podcast, label: "Podcasts", href: "/podcasts" },
  { icon: Ticket, label: "Live Events", href: "/events" },
  { icon: Upload, label: "Upload Content", href: "/upload" },
  { icon: Download, label: "Downloads", href: "/downloads" },
]

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
}

function NavItem({ icon: Icon, label, href }: NavItemProps) {
  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 hover:bg-muted"
      >
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </Button>
    </Link>
  )
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background border-r",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <PlayCircle className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Vibe Vision</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
          </div>

          <Separator className="my-2" />

          {/* Library Section */}
          <div className="px-4 py-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Library
            </h2>
          </div>
          <div className="space-y-1 p-2">
            {libraryItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
          </div>

          <Separator className="my-2" />

          {/* Explore Section */}
          <div className="px-4 py-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Explore
            </h2>
          </div>
          <div className="space-y-1 p-2">
            {exploreItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
          </div>
        </nav>

        
      </aside>
    </>
  )
}