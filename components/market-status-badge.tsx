'use client'

import { useMarketStatus } from '@/lib/socket-client'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Activity, Clock, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function MarketStatusBadge() {
  const marketStatus = useMarketStatus()
  const [displayTime, setDisplayTime] = useState<string>('')

  useEffect(() => {
    if (!marketStatus) return

    const timer = setInterval(() => {
      const now = new Date()
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      setDisplayTime(istTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)

    return () => clearInterval(timer)
  }, [marketStatus])

  if (!marketStatus) {
    return (
      <Badge variant="secondary" className="gap-2">
        <Clock className="h-3 w-3 animate-spin" />
        Connecting...
      </Badge>
    )
  }

  const statusConfig = {
    open: {
      variant: 'default' as const,
      icon: Activity,
      label: 'Market Open',
      color: 'bg-green-500',
      pulse: true,
    },
    closed: {
      variant: 'secondary' as const,
      icon: AlertCircle,
      label: 'Market Closed',
      color: 'bg-red-500',
      pulse: false,
    },
    'pre-open': {
      variant: 'default' as const,
      icon: Clock,
      label: 'Pre-open',
      color: 'bg-amber-500',
      pulse: true,
    },
    'after-hours': {
      variant: 'secondary' as const,
      icon: Clock,
      label: 'After Hours',
      color: 'bg-gray-500',
      pulse: false,
    },
  }

  const config = statusConfig[marketStatus.status]
  const Icon = config.icon

  return (
    <div className="flex flex-col gap-2">
      <Badge
        variant={config.variant}
        className={`gap-2 ${config.pulse ? 'animate-pulse' : ''} text-foreground`}
      >
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
      <div className="text-xs text-muted-foreground">
        <div>{marketStatus.formattedStatus}</div>
        <div className="font-mono text-xs mt-1">{displayTime}</div>
      </div>
    </div>
  )
}
