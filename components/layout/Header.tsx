import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: string;
  avatar: string;
}

interface HeaderProps {
  onSidebarOpen: () => void;
  isAuthenticated?: boolean;
  isSidebarCollapsed: boolean;
  onSidebarCollapse: () => void;
}

interface Breadcrumb {
  label: string;
  path: string;
}

export function Header({
  onSidebarOpen,
  isAuthenticated = false,
  isSidebarCollapsed,
  onSidebarCollapse,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(5);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New follower",
      message: "John Doe started following you",
      time: "2 min ago",
      isRead: false,
      type: "follow",
      avatar: "/avatars/john.png",
    },
  ]);

  // Initialize localStorage safely
  const storage = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return null;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    setUnreadCount(0);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getBreadcrumbs = useMemo((): Breadcrumb[] => {
    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) return [{ label: "Home", path: "/" }];

    return paths.reduce<Breadcrumb[]>((acc, path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      acc.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        path: url,
      });
      return acc;
    }, [{ label: "Home", path: "/" }]);
  }, [pathname]);

  const handleLogout = () => {
    if (storage) {
      storage.removeItem('token');
      storage.removeItem('loggedInUser');
      storage.removeItem('loggedInUserEmail');
    }
    router.push('/');
  };

  const username = storage?.getItem('loggedInUser') || '';

  if (!mounted) return null;

  return (
    <div className="fixed top-0 z-50 w-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4">
          {/* Sidebar Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarOpen}
              className="lg:hidden"
              aria-label="Toggle mobile sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarCollapse}
              className="hidden lg:flex"
              aria-label="Toggle desktop sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Vibe Vision Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500/30 to-pink-400">
              Vibe Vision
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Menu */}
            <UserMenu 
              isAuthenticated={isAuthenticated}
              username={username}
              onLogout={handleLogout}
              showUserMenu={showUserMenu}
              setShowUserMenu={setShowUserMenu}
            />

            {/* Notifications */}
            {isAuthenticated && (
              <NotificationsPanel
                notifications={notifications}
                unreadCount={unreadCount}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                markAllAsRead={markAllAsRead}
                markNotificationAsRead={markNotificationAsRead}
              />
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav className="px-4 py-2 bg-muted/50 border-b" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {getBreadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
              <Link
                href={breadcrumb.path}
                className={`text-sm hover:text-primary transition-colors ${
                  index === getBreadcrumbs.length - 1
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
  );
}

// Extracted UserMenu component
const UserMenu = ({
  isAuthenticated,
  username,
  onLogout,
  showUserMenu,
  setShowUserMenu
}: {
  isAuthenticated: boolean;
  username: string;
  onLogout: () => void;
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
}) => (
  <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/user.png" alt="User" />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      {isAuthenticated ? (
        <>
          <DropdownMenuLabel>My Account | {username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Upload className="mr-2 h-4 w-4" /> Studio
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <Link href="/login">
            <DropdownMenuItem>Log in</DropdownMenuItem>
          </Link>
          <Link href="/signup">
            <DropdownMenuItem>Sign up</DropdownMenuItem>
          </Link>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Extracted NotificationsPanel component
const NotificationsPanel = ({
  notifications,
  unreadCount,
  showNotifications,
  setShowNotifications,
  markAllAsRead,
  markNotificationAsRead
}: {
  notifications: Notification[];
  unreadCount: number;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  markAllAsRead: () => void;
  markNotificationAsRead: (id: number) => void;
}) => (
  <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="relative">
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
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
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
                notification.isRead ? 'bg-background' : 'bg-muted'
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={notification.avatar} />
                  <AvatarFallback>{notification.title[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{notification.title}</h4>
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
);

export default Header;