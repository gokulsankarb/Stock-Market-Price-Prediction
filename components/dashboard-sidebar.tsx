'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

interface DashboardSidebarProps {
  firstName?: string
}

export function DashboardSidebar({ firstName }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: User,
    },
  ]

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-bold text-sidebar-foreground">StockAI</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <TrendingUp className="h-6 w-6 text-sidebar-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 text-sidebar-foreground", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Welcome Message */}
      {!collapsed && firstName && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-sm text-sidebar-foreground/70">Welcome back,</p>
          <p className="font-semibold text-sidebar-foreground truncate">{firstName}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <ThemeToggle />
      </div>

      {/* Sign Out */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </aside>
  )
}
