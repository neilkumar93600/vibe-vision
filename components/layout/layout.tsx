// components/layout/Layout.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  // State for both mobile sidebar visibility and desktop sidebar collapse
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [localStorageInstance,  setLocalStorageInstance] = useState<Storage | null>(null)

  // Handler for mobile sidebar toggle
  const handleSidebarOpen = () => {
    setIsSidebarOpen(true)
  }

  // Handler for mobile sidebar close
  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  // Handler for desktop sidebar collapse toggle
  const handleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  useEffect(() => {
    setLocalStorageInstance(localStorage)
  }, [])
  

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <Header 
        onSidebarOpen={handleSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarCollapse={handleSidebarCollapse}
        isAuthenticated={ Boolean(localStorageInstance?.getItem('token') || false)}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={handleSidebarClose}
      />
      <main className={`${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-72'} pt-[100px] transition-all duration-300`}>
        <div className="h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}