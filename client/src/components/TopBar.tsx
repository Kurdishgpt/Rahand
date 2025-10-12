import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon, Sun, Languages, Home } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "wouter";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between p-3 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-home"
            title={t("home")}
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          data-testid="button-language"
          title={language === "en" ? t("kurdish") : t("english")}
        >
          <Languages className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme"
          title={theme === "dark" ? t("lightMode") : t("darkMode")}
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
