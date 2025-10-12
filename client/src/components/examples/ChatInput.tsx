import { ChatInput } from "../ChatInput";
import { LanguageProvider } from "../LanguageProvider";

export default function ChatInputExample() {
  return (
    <LanguageProvider>
      <div className="h-screen flex flex-col">
        <div className="flex-1" />
        <ChatInput
          onSendMessage={(msg) => console.log("Send:", msg)}
          onGenerateImage={(prompt) => console.log("Generate:", prompt)}
        />
      </div>
    </LanguageProvider>
  );
}
