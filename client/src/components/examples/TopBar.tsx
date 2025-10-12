import { TopBar } from "../TopBar";
import { ThemeProvider } from "../ThemeProvider";
import { LanguageProvider } from "../LanguageProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function TopBarExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <TopBar />
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
