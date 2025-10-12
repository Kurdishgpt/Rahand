import { useState, useCallback, useRef, useEffect } from "react";

interface UseTextToSpeechProps {
  language: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export function useTextToSpeech({ 
  language, 
  onStart, 
  onEnd,
  onError 
}: UseTextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (utteranceRef.current && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      onError?.("Text-to-speech is not supported in this browser");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const langCode = language === "ku" ? "ar-SA" : "en-US";
    utterance.lang = langCode;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      onError?.(event.error);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [language, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
  };
}
