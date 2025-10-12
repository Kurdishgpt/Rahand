import { VoiceButton } from "../VoiceButton";
import { useState } from "react";

export default function VoiceButtonExample() {
  const [state, setState] = useState<"idle" | "listening" | "processing">("idle");

  const handleToggle = () => {
    if (state === "idle") {
      setState("listening");
      setTimeout(() => setState("processing"), 2000);
      setTimeout(() => setState("idle"), 3500);
    } else {
      setState("idle");
    }
  };

  return (
    <div className="p-8 flex gap-4 items-center">
      <VoiceButton state={state} onToggle={handleToggle} />
      <span>State: {state}</span>
    </div>
  );
}
