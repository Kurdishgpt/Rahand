import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import ChatPage from "@/pages/ChatPage";
import { useState } from "react";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
      <Route path="*">
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl">404 - Page Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Kurdish Language Learning", timestamp: new Date() },
    { id: "2", title: "Image Generation Ideas", timestamp: new Date() },
  ]);
  const [activeConversation, setActiveConversation] = useState<string | null>("1");

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      timestamp: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(newConv.id);
  };

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <SidebarProvider style={sidebarStyle as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar
                  conversations={conversations}
                  activeId={activeConversation}
                  onNewChat={handleNewChat}
                  onSelectChat={setActiveConversation}
                />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-hidden">
                    <Router />
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
