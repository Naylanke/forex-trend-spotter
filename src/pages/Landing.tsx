import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, BarChart3, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CookieConsent } from "@/components/CookieConsent";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">ForexProAn</h1>
          <Button onClick={() => navigate("/app")} variant="default">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
          Professional Forex Trading Platform
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Real-time market analysis, advanced charting, and powerful trading tools designed for serious traders.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/app")}>
            Start Trading Now
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/app")}>
            Sign In
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose ForexProAn?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="w-12 h-12 text-chart-1 mb-4" />
              <CardTitle>Real-Time Data</CardTitle>
              <CardDescription>
                Live market updates every second with accurate price feeds and candlestick charts
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-chart-2 mb-4" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Comprehensive market flow analysis, trends, and technical indicators to guide your decisions
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 text-chart-3 mb-4" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Bank-level security with encrypted data and secure authentication for your peace of mind
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Market Information Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Understanding Forex Markets</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Clock className="w-10 h-10 text-primary mb-2" />
                <CardTitle>24/5 Market Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Forex markets operate 24 hours a day, 5 days a week. Trade major pairs like EUR/USD, GBP/USD, 
                  and USD/JPY during optimal market hours for maximum liquidity.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Currency Pairs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trade major, minor, and exotic currency pairs. Each pair represents the exchange rate between 
                  two currencies, offering diverse opportunities for profit in both rising and falling markets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trading Tips Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Essential Trading Knowledge</h3>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Never risk more than 1-2% of your capital on a single trade</li>
                <li>• Always use stop-loss orders to protect your positions</li>
                <li>• Diversify your trades across different currency pairs</li>
                <li>• Keep emotions in check and stick to your trading plan</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Technical Analysis Basics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Learn to read candlestick patterns for trend identification</li>
                <li>• Use support and resistance levels to time entries and exits</li>
                <li>• Monitor key economic indicators and news events</li>
                <li>• Combine multiple timeframes for better trade confirmation</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Market Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• London Session (8:00-17:00 GMT): Highest liquidity, best for EUR/GBP pairs</li>
                <li>• New York Session (13:00-22:00 GMT): High volatility, USD pairs most active</li>
                <li>• Asian Session (0:00-9:00 GMT): Lower volatility, good for JPY pairs</li>
                <li>• Session overlaps offer the most trading opportunities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Join Thousands of Successful Traders</h3>
          <p className="text-lg mb-8 opacity-90">
            Start your forex trading journey today with ForexProAn's powerful platform
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/app")}>
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ForexProAn. All rights reserved.</p>
          <p className="text-sm mt-2">
            Trading forex carries a high level of risk and may not be suitable for all investors.
          </p>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Landing;
