'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { NSE_STOCKS } from '@/lib/types'

interface StockSelectorProps {
  value: string
  onChange: (value: string) => void
  stockData?: Record<string, { changePercent: number }>
}

export function StockSelector({ value, onChange, stockData }: StockSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedStock = NSE_STOCKS.find(stock => stock.symbol === value)

  const getChangeIndicator = (symbol: string) => {
    if (!stockData || !stockData[symbol]) return null
    const change = stockData[symbol].changePercent
    if (change > 0) {
      return <TrendingUp className="h-3 w-3 text-success" />
    } else if (change < 0) {
      return <TrendingDown className="h-3 w-3 text-destructive" />
    }
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-card/50 border-border/50 hover:bg-card"
        >
          {selectedStock ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedStock.symbol.replace('.NS', '')}</span>
              <span className="text-muted-foreground text-sm hidden sm:inline">
                - {selectedStock.name}
              </span>
            </div>
          ) : (
            "Select stock..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command className="bg-popover">
          <CommandInput placeholder="Search stocks..." className="border-none focus:ring-0" />
          <CommandList>
            <CommandEmpty>No stock found.</CommandEmpty>
            <CommandGroup heading="NSE Stocks">
              {NSE_STOCKS.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={`${stock.symbol} ${stock.name} ${stock.sector}`}
                  onSelect={() => {
                    onChange(stock.symbol)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === stock.symbol ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <span className="font-medium">{stock.symbol.replace('.NS', '')}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        {stock.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {stock.sector}
                    </span>
                    {getChangeIndicator(stock.symbol)}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
