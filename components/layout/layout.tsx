// components/layout/Layout.tsx
"use client"

import React, { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarOpen={() => setIsSidebarOpen(true)} 
        isAuthenticated={false}  // Set this based on your auth state
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="lg:pl-72">
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
