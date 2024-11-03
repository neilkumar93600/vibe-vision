// components/layout/Layout.tsx
"use client"

import React, { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {

  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <Sidebar/>
      <main className="lg:pl-72">
        <div className="h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
