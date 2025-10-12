import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type VoiceState = "idle" | "listening" | "processing";

interface VoiceButtonProps {
  state: VoiceState;
  onToggle: () => void;
}

export function VoiceButton({ state, onToggle }: VoiceButtonProps) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onToggle}
      data-testid="button-voice"
      className={cn(
        "relative",
        state === "listening" && "bg-destructive/10 border-2 border-destructive"
      )}
    >
      {state === "processing" ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : state === "listening" ? (
        <>
          <Mic className="h-5 w-5 text-destructive" />
          <span className="absolute inset-0 rounded-lg animate-ping bg-destructive/20" />
        </>
      ) : (
        <MicOff className="h-5 w-5" />
      )}
    </Button>
  );
}
