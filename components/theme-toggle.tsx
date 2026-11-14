'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return

    const htmlElement = document.documentElement
    const newDarkMode = !isDark

    if (newDarkMode) {
      htmlElement.classList.add('dark')
      htmlElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      htmlElement.classList.remove('dark')
      htmlElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    }

    setIsDark(newDarkMode)
  }

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-border text-foreground hover:bg-secondary"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
