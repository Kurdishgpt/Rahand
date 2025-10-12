import { MessageSquare, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface EmptyStateProps {
  onSuggestedPrompt: (prompt: string) => void;
}

export function EmptyState({ onSuggestedPrompt }: EmptyStateProps) {
  const { language, t } = useLanguage();

  const suggestedPrompts = [
    { 
      icon: MessageSquare, 
      text: t("suggestedPrompt1"),
      originalText: language === "en" ? "Tell me about Kurdish culture" : "باسی کلتووری کوردی بکە"
    },
    { 
      icon: Mic, 
      text: t("suggestedPrompt2"),
      originalText: language === "en" ? "How can I use voice features?" : "چۆن دەتوانم تایبەتمەندی دەنگ بەکاربهێنم؟"
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-semibold">{t("welcomeTitle")}</h2>
        <p className="text-muted-foreground">
          {t("welcomeSubtitle")}
        </p>

        <div className="grid gap-3 mt-6">
          {suggestedPrompts.map((prompt, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="justify-start gap-3 h-auto py-3 px-4"
              onClick={() => onSuggestedPrompt(prompt.originalText)}
              data-testid={`suggested-${idx}`}
            >
              <prompt.icon className="h-5 w-5 shrink-0" />
              <div className={language === "ku" ? "text-right" : "text-left"}>
                <div className="font-medium">{prompt.text}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
