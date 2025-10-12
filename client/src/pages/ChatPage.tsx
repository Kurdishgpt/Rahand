import { useState } from "react";
import { ChatMessage as ChatMessageComponent, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { EmptyState } from "@/components/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/hooks/useLanguage";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { language, t } = useLanguage();

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    setTimeout(() => {
      const demoResponses = {
        en: `This is a demo response to: "${content}". In the full version, this will connect to OpenAI for real AI responses in Kurdish Central and English.`,
        ku: `ئەمە وەڵامێکی نموونەیە بۆ: "${content}". لە وەشانی تەواودا، ئەمە بە OpenAI دەبەستێتەوە بۆ وەڵامی AI ی ڕاستەقینە بە کوردی ناوەندی و ئینگلیزی.`
      };
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: demoResponses[language],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateImage = (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: language === "en" ? `Generate image: ${prompt}` : `دروستکردنی وێنە: ${prompt}`,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    setTimeout(() => {
      const imageMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: language === "en" ? "Generated image" : "وێنەی دروستکراو",
        type: "image",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, imageMessage]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <EmptyState onSuggestedPrompt={handleSendMessage} />
      ) : (
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatMessageComponent key={msg.id} message={msg} />
            ))}
            {isGenerating && (
              <ChatMessageComponent
                message={{
                  id: "temp",
                  role: "assistant",
                  content: t("thinking"),
                  timestamp: new Date(),
                }}
                isStreaming
              />
            )}
          </div>
        </ScrollArea>
      )}
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onGenerateImage={handleGenerateImage}
        disabled={isGenerating}
      />
    </div>
  );
}
