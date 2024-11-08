import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Music2,
  Mic2,
  Tv,
  Clock,
  ListVideo,
  Star,
  History,
  Heart,
  X,
  SparklesIcon,
  LogInIcon,
  User
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
}

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  secondaryIcon?: React.ElementType
}

// Updated navigation items with correct app directory routing
const authenticatedNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Tv, label: "Entertainment Hub", href: "/entertainment-hub", badge: "Hot", badgeVariant: "destructive" },
  { icon: Music2, label: "Music Studio", href: "/music-studio" },
  { icon: Mic2, label: "Comedy Lab", href: "/comedy-lab" },
  { icon: User, label: "Profile", href: "/profile-page" },
]

const nonAuthenticatedNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Tv, label: "Entertainment Hub", href: "/entertainment-hub", badge: "Hot", badgeVariant: "destructive" },
  { icon: LogInIcon, label: "Login to Generate", href: "/login", secondaryIcon: SparklesIcon },
]

const libraryItems: NavItem[] = [
  { icon: ListVideo, label: "Your Playlists", href: "/playlists" },
  { icon: Clock, label: "Watch Later", href: "/watch-later", badge: "3", badgeVariant: "secondary" },
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Heart, label: "Liked Content", href: "/liked", badge: "2", badgeVariant: "outline" },
  { icon: History, label: "History", href: "/history" },
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
  secondaryIcon: SecondaryIcon,
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
          {!isCollapsed && SecondaryIcon &&
            <SecondaryIcon fill='#6366f1' color='#6366f1' className='ml-auto bg/-indigo-500' />
          }
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
            secondaryIcon={item.secondaryIcon}
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
  const [localStorageInstance,  setLocalStorageInstance] = React.useState<Storage | null>(null)
  
  React.useEffect(() => {
    setLocalStorageInstance(localStorage);
  }, [])
  

  return (
    <>
      {/* Overlay - only show on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/180 backdrop-blur-sm z-40 lg:hidden"
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
            {localStorageInstance?.getItem('token') ? <NavSection
              title="Main"
              items={authenticatedNavItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            /> :
              <NavSection
                title="Main"
                items={nonAuthenticatedNavItems}
                currentPath={pathname}
                isCollapsed={isCollapsed}
                onClose={onClose}
              />

            }
            <Separator className="my-2" />
            {/* Library Section */}
            {/* <NavSection
              title="Library"
              items={libraryItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            /> */}
            {/* <Separator className="my-2" /> */}
          </nav>

        </ScrollArea>
      </aside>
    </>
  )
}

export default Sidebar;