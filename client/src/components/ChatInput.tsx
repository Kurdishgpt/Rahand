import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceButton, VoiceState } from "./VoiceButton";
import { Send, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onGenerateImage: (prompt: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onGenerateImage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isImageMode, setIsImageMode] = useState(false);
  const { t } = useLanguage();

  const handleSend = () => {
    if (message.trim()) {
      if (isImageMode) {
        onGenerateImage(message.trim());
      } else {
        onSendMessage(message.trim());
      }
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
    if (voiceState === "idle") {
      setVoiceState("listening");
      console.log("Voice listening started");
      setTimeout(() => {
        setVoiceState("processing");
        setTimeout(() => {
          setMessage("Sample voice input");
          setVoiceState("idle");
        }, 1000);
      }, 2000);
    } else {
      setVoiceState("idle");
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto flex gap-2 items-end">
        <Button
          size="icon"
          variant={isImageMode ? "default" : "ghost"}
          onClick={() => setIsImageMode(!isImageMode)}
          data-testid="button-image-mode"
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isImageMode ? t("imagePrompt") : t("typePlaceholder")}
            disabled={disabled}
            className="min-h-[44px] max-h-32 resize-none pr-12"
            data-testid="input-message"
          />
        </div>

        <VoiceButton state={voiceState} onToggle={handleVoiceToggle} />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          data-testid="button-send"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      {isImageMode && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          {t("imageModeActive")}
        </p>
      )}
    </div>
  );
}
