// components/layout/Layout.tsx
"use client"

import React, { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  // State for both mobile sidebar visibility and desktop sidebar collapse
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarOpen={handleSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarCollapse={handleSidebarCollapse}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={handleSidebarClose}
      />
      <main className={`lg:pl-${isSidebarCollapsed ? '16' : '72'} transition-all duration-300`}>
        <div className="h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}