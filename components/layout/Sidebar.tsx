import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Music2,
  Mic2,
  Tv,
  Radio,
  Clock,
  ListVideo,
  Star,
  History,
  Heart,
  Download,
  Youtube,
  Podcast,
  Ticket,
  Gamepad2,
  Newspaper,
  BookOpen,
  Coffee,
  Users,
  Trophy,
  Film,
  Flame,
  X
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
}

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

// Updated navigation items with correct app directory routing
const mainNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Flame, label: "Trending", href: "/trending", badge: "Hot", badgeVariant: "destructive" },
  { icon: Music2, label: "Music Studio", href: "/music-studio" },
  { icon: Mic2, label: "Comedy Lab", href: "/comedy-lab" },
  { icon: Tv, label: "Entertainment Hub", href: "/entertainment-hub" },
  { icon: Radio, label: "Live Shows", href: "/live-shows", badge: "Live", badgeVariant: "default" },
]

const libraryItems: NavItem[] = [
  { icon: ListVideo, label: "Your Playlists", href: "/playlists" },
  { icon: Clock, label: "Watch Later", href: "/watch-later", badge: "3", badgeVariant: "secondary" },
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Heart, label: "Liked Content", href: "/liked" },
  { icon: History, label: "History", href: "/history" },
  { icon: Download, label: "Downloads", href: "/downloads", badge: "2", badgeVariant: "outline" },
]

const exploreItems: NavItem[] = [
  { icon: Youtube, label: "Premium Content", href: "/premium" },
  { icon: Podcast, label: "Podcasts", href: "/podcasts" },
  { icon: Ticket, label: "Live Events", href: "/events" },
  { icon: Gamepad2, label: "Gaming", href: "/gaming" },
  { icon: Film, label: "Movies", href: "/movies", badge: "New", badgeVariant: "default" },
]

const communityItems: NavItem[] = [
  { icon: Users, label: "Creator Hub", href: "/creator-hub" },
  { icon: Trophy, label: "Competitions", href: "/competitions" },
  { icon: Coffee, label: "Creator Café", href: "/cafe" },
  { icon: Newspaper, label: "News & Updates", href: "/news" },
  { icon: BookOpen, label: "Learning", href: "/learning" },
]

interface NavItemProps extends NavItem {
  isActive: boolean
  isCollapsed: boolean
  onClose?: () => void
}

function NavItem({ 
  icon: Icon, 
  label, 
  href, 
  badge, 
  badgeVariant = "default", 
  isActive, 
  isCollapsed,
  onClose 
}: NavItemProps) {
  const content = (
    <Link href={href} passHref legacyBehavior>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 relative group",
          isActive && "bg-secondary",
          isCollapsed && "justify-center p-2"
        )}
        onClick={() => {
          if (onClose) {
            onClose()
          }
        }}
        asChild
      >
        <a>
          <Icon className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )} />
          {!isCollapsed && (
            <span className={cn(
              "text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {label}
            </span>
          )}
          {!isCollapsed && badge && (
            <Badge
              variant={badgeVariant}
              className="ml-auto"
            >
              {badge}
            </Badge>
          )}
        </a>
      </Button>
    </Link>
  )

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {label}
            {badge && (
              <Badge variant={badgeVariant}>{badge}</Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

interface NavSectionProps {
  title: string
  items: NavItem[]
  currentPath: string
  isCollapsed: boolean
  onClose?: () => void
}

function NavSection({ title, items, currentPath, isCollapsed, onClose }: NavSectionProps) {
  return (
    <>
      {!isCollapsed && (
        <div className="px-4 py-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {title}
          </h2>
        </div>
      )}
      <div className={cn("space-y-1", isCollapsed ? "px-2" : "p-2")}>
        {items.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            badge={item.badge}
            badgeVariant={item.badgeVariant}
            isActive={currentPath === item.href}
            isCollapsed={isCollapsed}
            onClose={onClose}
          />
        ))}
      </div>
    </>
  )
}

export function Sidebar({ isOpen, isCollapsed, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay - only show on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 flex flex-col bg-background border-r",
          "transition-all duration-300 ease-in-out",
          "top-[105px]", // Position below header + breadcrumbs
          "h-[calc(100vh-105px)]", // Adjust height to account for header + breadcrumbs
          isCollapsed ? "w-[70px]" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0" // Always show on desktop
        )}
      >
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-2 lg:hidden",
            isCollapsed && "right-1 top-1"
          )}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-2">
            {/* Main Navigation */}
            <NavSection
              title="Main"
              items={mainNavItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />

            <Separator className="my-2" />

            {/* Library Section */}
            <NavSection
              title="Library"
              items={libraryItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />

            <Separator className="my-2" />

            {/* Explore Section */}
            <NavSection
              title="Explore"
              items={exploreItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />

            <Separator className="my-2" />

            {/* Community Section */}
            <NavSection
              title="Community"
              items={communityItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />
          </nav>
        </ScrollArea>

        {/* Footer - only show when not collapsed */}
        {!isCollapsed && (
          <div className="border-t p-4">
            <Link href="/feedback" passHref legacyBehavior>
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <a target="_blank" rel="noopener noreferrer">
                  Send Feedback
                </a>
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar;