import React, { useState, useEffect, useRef, useCallback, FormEvent, ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  Settings,
  LogOut,
  User,
  Upload,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useTheme } from "next-themes";

// PlaceholdersAndVanishInput Component
const PlaceholdersAndVanishInput = ({ 
  placeholders, 
  onChange, 
  onSubmit 
}: {
  placeholders: string[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [value, setValue] = useState("")
  const [animating, setAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newDataRef = useRef<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    } else if (document.visibilityState === "visible") {
      startAnimation()
    }
  }

  useEffect(() => {
    startAnimation()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [placeholders])

  const draw = useCallback(() => {
    if (!inputRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 800
    ctx.clearRect(0, 0, 800, 800)
    const computedStyles = getComputedStyle(inputRef.current)

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"))
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`
    ctx.fillStyle = "#FFF"
    ctx.fillText(value, 16, 40)

    const imageData = ctx.getImageData(0, 0, 800, 800)
    const pixelData = imageData.data
    const newData: any[] = []

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n
        if (pixelData[e] !== 0 && pixelData[e + 1] !== 0 && pixelData[e + 2] !== 0) {
          newData.push({
            x: n,
            y: t,
            color: [pixelData[e], pixelData[e + 1], pixelData[e + 2], pixelData[e + 3]]
          })
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
    }))
  }, [value])

  useEffect(() => {
    draw()
  }, [value, draw])

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = []
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i]
          if (current.x < pos) {
            newArr.push(current)
          } else {
            if (current.r <= 0) {
              current.r = 0
              continue
            }
            current.x += Math.random() > 0.5 ? 1 : -1
            current.y += Math.random() > 0.5 ? 1 : -1
            current.r -= 0.05 * Math.random()
            newArr.push(current)
          }
        }
        newDataRef.current = newArr
        const ctx = canvasRef.current?.getContext("2d")
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800)
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color } = t
            if (n > pos) {
              ctx.beginPath()
              ctx.rect(n, i, s, s)
              ctx.fillStyle = color
              ctx.strokeStyle = color
              ctx.stroke()
            }
          })
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8)
        } else {
          setValue("")
          setAnimating(false)
        }
      })
    }
    animateFrame(start)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit()
    }
  }

  const vanishAndSubmit = () => {
    setAnimating(true)
    draw()

    const value = inputRef.current?.value || ""
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      )
      animate(maxX)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    vanishAndSubmit()
    onSubmit && onSubmit(e)
  }

  return (
    <form
      className="w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
      onSubmit={handleSubmit}
    >
      <canvas
        className={`absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20 ${
          !animating ? "opacity-0" : "opacity-100"
        }`}
        ref={canvasRef}
      />
      <input
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value)
            onChange && onChange(e)
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className={`w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20 ${
          animating && "text-transparent dark:text-transparent"
        }`}
      />
      <button
        disabled={!value}
        type="submit"
        className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%"
            }}
            animate={{
              strokeDashoffset: value ? 0 : "50%"
            }}
            transition={{
              duration: 0.3,
              ease: "linear"
            }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1
              }}
              exit={{
                y: -15,
                opacity: 0
              }}
              transition={{
                duration: 0.3,
                ease: "linear"
              }}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}

interface HeaderProps {
  onSidebarOpen: () => void
  isAuthenticated?: boolean
  isSidebarCollapsed: boolean
  onSidebarCollapse: () => void
}

export function Header({ 
  onSidebarOpen, 
  isAuthenticated, 
  isSidebarCollapsed,
  onSidebarCollapse 
}: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [unreadCount, setUnreadCount] = useState(5)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const [localStorageInstance,  setLocalStorageInstance] = useState<Storage | null>(null)
  
  useEffect(() => {
    setLocalStorageInstance(localStorage);
  }, [])
  

  const searchPlaceholders = [
    "Search for videos...",
    "Find creators...",
    "Discover new content...",
    "Search by tags...",
    "Find live streams..."
  ]

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New follower",
      message: "John Doe started following you",
      time: "2 min ago",
      isRead: false,
      type: "follow",
      avatar: "/avatars/john.png",
    },
    // ... other notifications
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
    setUnreadCount(0);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) return [{ label: "Home", path: "/" }];

    return paths.reduce((acc, path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      acc.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        path: url,
      });
      return acc;
    }, [{ label: "Home", path: "/" }]);
  };

  const handleLogout = () => {
    localStorageInstance?.removeItem('token');
    localStorageInstance?.removeItem('loggedInUser');
    localStorageInstance?.removeItem('loggedInUserEmail');
    
    // Redirect to login page
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-0 z-50 w-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4">
          {/* Toggle Sidebar Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarOpen}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarCollapse}
              className="hidden lg:flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purole-500/30 to-pink-400">Vibe Vision</span>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-auto">
            <PlaceholdersAndVanishInput
              placeholders={searchPlaceholders}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Section */}
            <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isAuthenticated ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/user.png" alt="User" />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>My Account | {localStorageInstance?.getItem('loggedInUser')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Upload className="mr-2 h-4 w-4" />
                      Studio
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <DropdownMenuItem>
                        Log in
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/signup">
                      <DropdownMenuItem>
                        Sign up
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications (only shown when authenticated) */}
            {isAuthenticated && (
              <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle className="flex justify-between items-center">
                      <span>Notifications</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg transition-colors ${
                            notification.isRead
                              ? 'bg-background'
                              : 'bg-muted'
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={notification.avatar} />
                              <AvatarFallback>
                                {notification.title[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="px-4 py-2 bg-muted/50 border-b">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {getBreadcrumbs().map((breadcrumb, index) => (
              <li key={breadcrumb.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                )}
                <Link
                  href={breadcrumb.path}
                  className={`text-sm hover:text-primary transition-colors ${
                    index === getBreadcrumbs().length - 1
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {breadcrumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

export default Header;