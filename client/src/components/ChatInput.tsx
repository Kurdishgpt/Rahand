import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceButton, VoiceState } from "./VoiceButton";
import { Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language,
    onResult: (transcript) => {
      setMessage(transcript);
      toast({
        description: language === "en" 
          ? `Recognized: ${transcript}` 
          : `گوێگیرا: ${transcript}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: language === "en" 
          ? `Voice error: ${error}` 
          : `هەڵەی دەنگ: ${error}`,
      });
    },
  });

  const effectiveVoiceState: VoiceState = isListening ? "listening" : voiceState;

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t("typePlaceholder")}
            disabled={disabled}
            className="min-h-[44px] max-h-32 resize-none pr-12"
            data-testid="input-message"
          />
        </div>

        <VoiceButton state={effectiveVoiceState} onToggle={handleVoiceToggle} />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          data-testid="button-send"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
