import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon, Sun, Home } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "@/hooks/useLanguage";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="flex items-center justify-between p-3 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHomeClick}
          data-testid="button-home"
          title={language === "en" ? "Home" : "ماڵەوە"}
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={language === "en" ? "default" : "outline"}
          onClick={toggleLanguage}
          data-testid="button-language-english"
          className="min-w-[80px]"
        >
          English
        </Button>
        
        <Button
          variant={language === "ku" ? "default" : "outline"}
          onClick={toggleLanguage}
          data-testid="button-language-kurdish"
          className="min-w-[80px]"
        >
          کوردی
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme"
          title={theme === "dark" ? (language === "en" ? "Light Mode" : "دۆخی ڕووناک") : (language === "en" ? "Dark Mode" : "دۆخی تاریک")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
