import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion"
import {
  Home,
  Music2,
  Video,
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
import { useMediaQuery } from "../../hooks/use-media-query"

// Types and interfaces
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
  secondaryIcon?: React.ElementType
  index?: number
}

// Custom hook for managing navigation gestures
const useNavigationGestures = (items: NavItem[], currentIndex: number) => {
  const router = useRouter()
  const controls = useAnimation()
  const [activeIndex, setActiveIndex] = React.useState(currentIndex)
  const [dragDirection, setDragDirection] = React.useState<'left' | 'right' | null>(null)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 50
    const velocity = Math.abs(info.velocity.x)
    const direction = info.offset.x > 0 ? 'right' : 'left'
    
    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      const newIndex = direction === 'right' 
        ? Math.max(0, activeIndex - 1)
        : Math.min(items.length - 1, activeIndex + 1)
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
        await controls.start({ x: direction === 'right' ? 100 : -100, opacity: 0 })
        router.push(items[newIndex].href)
        controls.set({ x: direction === 'right' ? -100 : 100 })
        await controls.start({ x: 0, opacity: 1 })
      } else {
        controls.start({ x: 0 })
      }
    } else {
      controls.start({ x: 0 })
    }
    
    setDragDirection(null)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragDirection(info.offset.x > 0 ? 'right' : 'left')
  }

  return {
    activeIndex,
    setActiveIndex,
    controls,
    handleDrag,
    handleDragEnd,
    dragDirection
  }
}

// Navigation items
const authenticatedNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/", index: 0 },
  { icon: Tv, label: "Entertainment Hub", href: "/entertainment-hub", badge: "Hot", badgeVariant: "destructive", index: 1 },
  { icon: Video, label: "Studio", href: "/Studio", index: 2 },
  { icon: User, label: "Profile", href: "/profile-page", index: 3 },
]

const nonAuthenticatedNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/", index: 0 },
  { icon: Tv, label: "Entertainment Hub", href: "/entertainment-hub", badge: "Hot", badgeVariant: "destructive", index: 1 },
  { icon: LogInIcon, label: "Login to Generate", href: "/login", secondaryIcon: SparklesIcon, index: 2 },
]

const libraryItems: NavItem[] = [
  { icon: History, label: "History", href: "/history", index: 0 },
  { icon: Clock, label: "Watch Later", href: "/watch-later", badge: "3", badgeVariant: "secondary", index: 1 },
  { icon: ListVideo, label: "Your Playlists", href: "/playlists", index: 2 },
  { icon: Heart, label: "Liked Content", href: "/liked", badge: "2", badgeVariant: "outline", index: 3 },
]

// Progress indicator component
const ProgressIndicator = ({ active, total }: { active: number; total: number }) => (
  <div className="flex justify-center space-x-1 mt-1">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "h-1 rounded-full transition-all duration-300",
          i === active ? "w-4 bg-primary" : "w-1 bg-muted",
        )}
      />
    ))}
  </div>
)

// Gesture hint component
const GestureHint = ({ direction }: { direction: 'left' | 'right' | null }) => {
  if (!direction) return null;
  
  return (
    <div className={cn(
      "fixed top-1/2 transform -translate-y-1/2 transition-opacity duration-200",
      direction === 'left' ? "right-4" : "left-4"
    )}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="text-primary text-2xl"
      >
        {direction === 'left' ? '→' : '←'}
      </motion.div>
    </div>
  );
}

interface NavItemProps extends NavItem {
  isActive: boolean
  isCollapsed: boolean
  isMobile?: boolean
  onClose?: () => void
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(({
  icon: Icon,
  label,
  href,
  badge,
  badgeVariant = "default",
  secondaryIcon: SecondaryIcon,
  isActive,
  isCollapsed,
  isMobile,
  onClose
}, ref) => {
  const content = (
    <Link href={href} passHref legacyBehavior>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "relative group transition-all duration-200",
          isActive && "bg-secondary",
          isMobile 
            ? "flex-col items-center justify-center p-2 h-auto min-w-[72px]" 
            : cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center p-2"
              )
        )}
        onClick={() => {
          if (onClose) {
            onClose()
          }
        }}
        asChild
      >
        <motion.a
          ref={ref}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center",
            isMobile && "flex-col gap-1"
          )}
        >
          <Icon className={cn(
            "transition-colors",
            isMobile ? "h-5 w-5" : "h-4 w-4",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )} />
          
          {(!isCollapsed || isMobile) && (
            <span className={cn(
              "transition-colors",
              isMobile ? "text-xs" : "text-sm font-medium",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {label}
            </span>
          )}
          
          {!isCollapsed && !isMobile && badge && (
            <Badge
              variant={badgeVariant}
              className="ml-auto"
            >
              {badge}
            </Badge>
          )}
          
          {!isCollapsed && !isMobile && SecondaryIcon && (
            <SecondaryIcon 
              fill='#6366f1' 
              color='#6366f1' 
              className='ml-auto bg-indigo-500' 
            />
          )}
          
          {isMobile && badge && (
            <Badge
              variant={badgeVariant}
              className="absolute -top-1 -right-1 text-xs px-1"
            >
              {badge}
            </Badge>
          )}
        </motion.a>
      </Button>
    </Link>
  )

  if (isCollapsed && !isMobile) {
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
})

NavItem.displayName = "NavItem"

interface NavSectionProps {
  title: string
  items: NavItem[]
  currentPath: string
  isCollapsed: boolean
  isMobile?: boolean
  onClose?: () => void
}

function NavSection({ title, items, currentPath, isCollapsed, isMobile, onClose }: NavSectionProps) {
  const currentIndex = items.findIndex(item => item.href === currentPath)
  const {
    activeIndex,
    controls,
    handleDrag,
    handleDragEnd,
    dragDirection
  } = useNavigationGestures(items, currentIndex)

  if (isMobile) {
    return (
      <>
        <motion.div
          className="flex justify-around w-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {items.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={currentPath === item.href}
              isCollapsed={isCollapsed}
              isMobile={true}
              onClose={onClose}
            />
          ))}
        </motion.div>
        <ProgressIndicator active={activeIndex} total={items.length} />
        <GestureHint direction={dragDirection} />
      </>
    )
  }

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
            {...item}
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
  const [localStorageInstance, setLocalStorageInstance] = React.useState<Storage | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  React.useEffect(() => {
    setLocalStorageInstance(window?.localStorage)
  }, [])

  const isAuthenticated = localStorageInstance?.getItem('token')
  const mainNavItems = isAuthenticated ? authenticatedNavItems : nonAuthenticatedNavItems

  if (isMobile) {
    return (
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-2"
        role="navigation"
        aria-label="Main"
      >
        <NavSection
          title="Navigation"
          items={mainNavItems}
          currentPath={pathname}
          isCollapsed={false}
          isMobile={true}
          onClose={onClose}
        />
      </motion.nav>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed z-50 flex flex-col bg-background border-r",
          "transition-all duration-300 ease-in-out",
          "top-[105px]",
          "h-[calc(100vh-105px)]",
          isCollapsed ? "w-[70px]" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
        role="navigation"
        aria-label="Main"
      >
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

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-2">
            <NavSection
              title="Main"
              items={mainNavItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />
            <Separator className="my-2" />
            <NavSection
              title="Library"
              items={libraryItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />
            <Separator className="my-2" />
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}

export default Sidebar;