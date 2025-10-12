import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LanguageProvider } from "../LanguageProvider";

const mockConversations = [
  { id: "1", title: "Kurdish Language Learning", timestamp: new Date() },
  { id: "2", title: "Image Generation Ideas", timestamp: new Date() },
  { id: "3", title: "Voice Commands Help", timestamp: new Date() },
];

export default function AppSidebarExample() {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar
            conversations={mockConversations}
            activeId="1"
            onNewChat={() => console.log("New chat")}
            onSelectChat={(id) => console.log("Select:", id)}
          />
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
}
