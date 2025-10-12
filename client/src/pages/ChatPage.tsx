import { useState } from "react";
import { ChatMessage as ChatMessageComponent, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { EmptyState } from "@/components/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/hooks/useLanguage";

type Language = "en" | "ku";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { language, t } = useLanguage();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    const assistantMessageId = (Date.now() + 1).toString();
    let accumulatedContent = "";

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...conversationHistory, { role: "user", content }],
          language
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setIsGenerating(false);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                
                setMessages((prev) => {
                  const existing = prev.find(m => m.id === assistantMessageId);
                  if (existing) {
                    return prev.map(m =>
                      m.id === assistantMessageId
                        ? { ...m, content: accumulatedContent }
                        : m
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        id: assistantMessageId,
                        role: "assistant" as const,
                        content: accumulatedContent,
                        timestamp: new Date(),
                      },
                    ];
                  }
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: language === "en" 
            ? "Sorry, I encountered an error. Please try again."
            : "ببورە، هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەرەوە.",
          timestamp: new Date(),
        },
      ]);
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: language === "en" ? `Generate image: ${prompt}` : `دروستکردنی وێنە: ${prompt}`,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const { imageUrl } = await response.json();
      
      const imageMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: language === "en" ? "Generated image" : "وێنەی دروستکراو",
        type: "image",
        imageUrl,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, imageMessage]);
    } catch (error) {
      console.error("Image generation error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: language === "en"
            ? "Failed to generate image. Please try again."
            : "نەتوانرا وێنە دروست بکرێت. تکایە دووبارە هەوڵ بدەرەوە.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
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
