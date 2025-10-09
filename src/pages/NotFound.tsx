import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">ForexPro</span>
            </div>
          </div>
          <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-xl">
            Oops! Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1" variant="default">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
            <Button asChild className="flex-1" variant="outline" onClick={() => window.history.back()}>
              <button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </button>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
