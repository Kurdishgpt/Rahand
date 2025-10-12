import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Settings } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface AppSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export function AppSidebar({
  conversations,
  activeId,
  onNewChat,
  onSelectChat,
}: AppSidebarProps) {
  const { t } = useLanguage();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-2 pb-2">
            <Button
              onClick={onNewChat}
              className="w-full justify-start gap-2"
              data-testid="button-new-chat"
            >
              <PlusCircle className="h-4 w-4" />
              {t("newChat")}
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("chatHistory")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectChat(conv.id)}
                    isActive={activeId === conv.id}
                    data-testid={`chat-${conv.id}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="truncate">{conv.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton data-testid="button-settings">
              <Settings className="h-4 w-4" />
              <span>{t("settings")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
