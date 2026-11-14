import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-destructive/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-xl border-border/50 text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-8 w-8" />
              <span className="text-2xl font-bold text-foreground">StockAI</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground">Authentication Error</CardTitle>
          <CardDescription className="text-muted-foreground">
            Something went wrong during authentication. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Try Again
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              Go to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
