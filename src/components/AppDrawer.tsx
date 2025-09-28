import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { useTheme } from "next-themes";
import { 
  Menu, 
  Download, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Smartphone,
  Monitor,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AppDrawerProps {
  onNavigate?: (page: string) => void;
}

export const AppDrawer = ({ onNavigate }: AppDrawerProps) => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  const handleNavigation = (page: string) => {
    if (page === 'download') {
      window.location.href = '/download';
    } else {
      onNavigate?.(page);
    }
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex flex-col px-4 pb-4 space-y-6">
          {/* Download Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">DOWNLOAD APPS</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleNavigation('download')}
              >
                <Smartphone className="mr-3 h-4 w-4" />
                Download Mobile App
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleNavigation('download')}
              >
                <Monitor className="mr-3 h-4 w-4" />
                Download Desktop App
              </Button>
            </div>
          </div>

          <Separator />

          {/* Theme Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">APPEARANCE</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>

          <Separator />

          {/* Account Section */}
          {user && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">ACCOUNT</h3>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => handleNavigation('settings')}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" 
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </>
          )}

          {/* User Info */}
          {user && (
            <div className="mt-auto pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                Signed in as: {user.email}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};