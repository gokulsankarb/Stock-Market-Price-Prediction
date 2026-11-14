import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Mail, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
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
            <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground">Check your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            {"We've sent you a confirmation link to verify your account. Please check your inbox and click the link to complete registration."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground text-left">
              {"If you don't see the email, check your spam folder or try again."}
            </p>
          </div>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
