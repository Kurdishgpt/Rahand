import ChatPage from "../ChatPage";
import { LanguageProvider } from "@/components/LanguageProvider";

export default function ChatPageExample() {
  return (
    <LanguageProvider>
      <div className="h-screen">
        <ChatPage />
      </div>
    </LanguageProvider>
  );
}
