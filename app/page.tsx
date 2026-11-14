import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TrendingUp, Brain, LineChart, Shield, ArrowRight, BarChart3, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">StockAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-sm text-primary mb-6">
            <Brain className="h-4 w-4" />
            Powered by LSTM Deep Learning
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            AI-Powered Stock
            <br />
            <span className="text-primary">Price Predictions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Harness the power of LSTM neural networks to predict NSE stock prices. 
            Get intelligent insights and make informed investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth/sign-up">
                Start Predicting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligent Stock Analysis
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our platform combines advanced machine learning with real-time market data 
              to deliver accurate predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">LSTM Neural Network</h3>
              <p className="text-muted-foreground">
                Advanced Long Short-Term Memory networks trained on historical price data 
                for accurate predictions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Charts</h3>
              <p className="text-muted-foreground">
                Interactive charts with historical data, moving averages, and 
                prediction overlays.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">15 NSE Stocks</h3>
              <p className="text-muted-foreground">
                Coverage of top NSE stocks including Reliance, TCS, HDFC Bank, 
                Infosys, and more.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">7-Day Forecasts</h3>
              <p className="text-muted-foreground">
                Get predictions for up to 7 days ahead with confidence scores 
                and trend analysis.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with encrypted data storage and 
                secure authentication.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Buy/Sell Signals</h3>
              <p className="text-muted-foreground">
                AI-generated trading signals based on predicted price movements 
                and technical analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Predicting?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join StockAI today and get access to AI-powered stock predictions 
            for the Indian stock market.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/auth/sign-up">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold">StockAI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Disclaimer: Predictions are for educational purposes only. Not financial advice.
            </p>
            <p className="text-sm text-muted-foreground">
              2024 StockAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
