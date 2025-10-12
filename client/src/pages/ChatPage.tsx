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
      const getDemoResponse = (question: string, lang: Language): string => {
        const lower = question.toLowerCase();
        
        if (lang === "en") {
          if (lower.includes("kurdish culture") || lower.includes("culture")) {
            return "Kurdish culture is rich and diverse, with a history spanning thousands of years. It includes vibrant traditions in music, dance, literature, and art. Kurdish people celebrate festivals like Newroz (New Year) and have a strong oral storytelling tradition. The Kurdish language has several dialects, with Sorani (Central Kurdish) and Kurmanji being the most widely spoken.";
          }
          if (lower.includes("voice") || lower.includes("features")) {
            return "To use voice features, click the microphone button next to the input field. You can speak in either English or Kurdish, and the AI will transcribe and respond to your message. The system supports Kurdish Central (Sorani) text-to-speech for natural voice responses.";
          }
          if (lower.includes("hello") || lower.includes("hi")) {
            return "Hello! I'm your AI assistant with Kurdish and English language support. I can help you with conversations, answer questions, and even generate images. How can I assist you today?";
          }
          return `I understand you're asking about: "${question}". I'm here to help with conversations in both Kurdish Central and English, as well as generate images based on your descriptions. What would you like to know more about?`;
        } else {
          if (lower.includes("کلتوور") || lower.includes("culture")) {
            return "کلتووری کوردی دەوڵەمەند و فرەڕەنگە، مێژوویەکی بە هەزاران ساڵی هەیە. نەریتە زیندووەکانی لە مۆزیک، سەما، ئەدەبیات و هونەردا دەگرێتەوە. گەلی کورد جەژنەکانی وەک نەورۆز (ساڵی نوێ) ئاهەنگ دەگرن و نەریتێکی بەهێزی چیرۆکگێڕانەی دەمکی هەیە.";
          }
          if (lower.includes("دەنگ") || lower.includes("voice")) {
            return "بۆ بەکارهێنانی تایبەتمەندی دەنگ، کرتە لە دوگمەی مایکرۆفۆن بکە لەتەنیشت خانەی نووسین. دەتوانیت بە کوردی یان ئینگلیزی قسە بکەیت، و AI پەیامەکەت دەنووسێتەوە و وەڵامت دەداتەوە.";
          }
          if (lower.includes("سڵاو") || lower.includes("بەخێربێ")) {
            return "سڵاو! من یاریدەدەری AI ـم بە پشتگیری زمانی کوردی و ئینگلیزی. دەتوانم یارمەتیت بدەم لە گفتوگۆکاندا، وەڵامی پرسیارەکان بدەمەوە، و تەنانەت وێنە دروست بکەم. چۆن دەتوانم یارمەتیت بدەم؟";
          }
          return `تێدەگەم کە پرسیارت دەکەیت دەربارەی: "${question}". من لێرەم بۆ یارمەتیدان لە گفتوگۆکاندا بە کوردی ناوەندی و ئینگلیزی، هەروەها دروستکردنی وێنە بەپێی وەسفەکانت. چی دەتەوێت زیاتر بزانیت؟`;
        }
      };
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getDemoResponse(content, language),
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
