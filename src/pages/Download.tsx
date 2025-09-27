import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Download as DownloadIcon, 
  Apple, 
  MonitorSpeaker,
  CheckCircle,
  Star,
  TrendingUp
} from "lucide-react";

export default function Download() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold">Download ForexPro</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the most advanced forex trading platform on all your devices. 
            Trade anywhere, anytime with real-time market data.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Mobile App */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary">Popular</Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Mobile App</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Trade on the go with our mobile app. Get push notifications and never miss a market move.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <Apple className="mr-2 h-5 w-5" />
                  Download for iOS
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <DownloadIcon className="mr-2 h-5 w-5" />
                  Download for Android
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-1 pt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.9 (12.5k)</span>
              </div>
            </CardContent>
          </Card>

          {/* Desktop App */}
          <Card>
            <CardHeader className="text-center pb-4">
              <MonitorSpeaker className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Desktop App</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Full-featured desktop application with advanced charting and analysis tools.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <DownloadIcon className="mr-2 h-5 w-5" />
                  Download for Windows
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Apple className="mr-2 h-5 w-5" />
                  Download for macOS
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <DownloadIcon className="mr-2 h-5 w-5" />
                  Download for Linux
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Web App */}
          <Card>
            <CardHeader className="text-center pb-4">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Web Platform</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Access your account instantly from any browser. No downloads required.
              </p>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.open('/', '_blank')}
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Launch Web Platform
                </Button>
                <p className="text-sm text-muted-foreground">
                  Works on Chrome, Firefox, Safari, Edge
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Features Across All Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Real-time market data and charts",
                  "Advanced technical analysis tools",
                  "Price alerts and notifications",
                  "Multi-currency support",
                  "Secure encrypted data",
                  "Offline chart viewing",
                  "Cloud synchronization",
                  "24/7 customer support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Mobile</h4>
                  <p className="text-sm text-muted-foreground">
                    iOS 14.0+ / Android 8.0+<br/>
                    1GB RAM, 100MB storage
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Desktop</h4>
                  <p className="text-sm text-muted-foreground">
                    Windows 10+ / macOS 10.15+ / Ubuntu 18.04+<br/>
                    4GB RAM, 500MB storage
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Web</h4>
                  <p className="text-sm text-muted-foreground">
                    Modern browser with JavaScript enabled<br/>
                    Stable internet connection recommended
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="text-center bg-primary/5">
          <CardContent className="py-8">
            <h3 className="text-2xl font-bold mb-4">Start Trading Today</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join millions of traders worldwide. Download ForexPro now and get access to 
              premium features for free during your first month.
            </p>
            <div className="space-x-4">
              <Button size="lg">
                <DownloadIcon className="mr-2 h-5 w-5" />
                Download Now
              </Button>
              <Button variant="outline" size="lg">
                View Pricing Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}