import { MessageSquare, Mic, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSuggestedPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  { icon: MessageSquare, text: "Tell me about Kurdish culture", textKu: "باسی کلتووری کوردی بکە" },
  { icon: Mic, text: "How can I use voice features?", textKu: "چۆن دەتوانم تایبەتمەندی دەنگ بەکاربهێنم؟" },
  { icon: ImageIcon, text: "Generate a beautiful landscape", textKu: "دیمەنێکی جوان دروست بکە" },
];

export function EmptyState({ onSuggestedPrompt }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-semibold">Welcome to AI Chat</h2>
        <p className="text-muted-foreground">
          Start a conversation in English or Kurdish, use voice commands, or generate images
        </p>

        <div className="grid gap-3 mt-6">
          {suggestedPrompts.map((prompt, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="justify-start gap-3 h-auto py-3 px-4"
              onClick={() => onSuggestedPrompt(prompt.text)}
              data-testid={`suggested-${idx}`}
            >
              <prompt.icon className="h-5 w-5 shrink-0" />
              <div className="text-left">
                <div className="font-medium">{prompt.text}</div>
                <div className="text-xs text-muted-foreground">{prompt.textKu}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
