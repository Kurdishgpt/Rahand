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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (utteranceRef.current && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    // Helper function for browser speech synthesis
    const useBrowserSpeech = () => {
      if (!("speechSynthesis" in window)) {
        const errorMsg = "Text-to-speech is not supported in this browser";
        onError?.(errorMsg);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      const langCode = language === "ku" ? "ar-SA" : "en-US";
      utterance.lang = langCode;
      
      const storedSpeed = localStorage.getItem("voiceSpeed");
      const storedPitch = localStorage.getItem("voicePitch");
      const storedVolume = localStorage.getItem("voiceVolume");
      
      utterance.rate = storedSpeed ? parseFloat(storedSpeed) : 0.9;
      utterance.pitch = storedPitch ? parseFloat(storedPitch) : 1.0;
      utterance.volume = storedVolume ? parseFloat(storedVolume) : 1.0;

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
    };

    const useKurdishAPI = localStorage.getItem("useKurdishAPI") === "true";
    
    if (language === "ku" && useKurdishAPI) {
      try {
        const voice = localStorage.getItem("kurdishVoice") || "SÎDAR";
        const speed = parseFloat(localStorage.getItem("voiceSpeed") || "0.9");
        
        const response = await fetch("/api/kurdish-tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, voice, speed }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error", fallback: false }));
          
          // If API is unavailable (503) or explicitly marked for fallback, use browser speech
          if (response.status === 503 || errorData.fallback) {
            console.warn(`Kurdish TTS API unavailable (${response.status}): ${errorData.error}. Falling back to browser speech synthesis.`);
            // Fall through to browser speech synthesis silently
          } else {
            console.error(`Kurdish TTS error (${response.status}):`, errorData.error);
            throw new Error(errorData.error || "Failed to generate Kurdish speech");
          }
        } else {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          audio.onplay = () => {
            setIsSpeaking(true);
            onStart?.();
          };
          
          audio.onended = () => {
            setIsSpeaking(false);
            onEnd?.();
            URL.revokeObjectURL(audioUrl);
          };
          
          audio.onerror = () => {
            console.warn("Kurdish audio playback failed, falling back to browser speech synthesis");
            URL.revokeObjectURL(audioUrl);
            useBrowserSpeech();
          };
          
          await audio.play();
          return;
        }
      } catch (error) {
        console.error("Kurdish TTS error:", error);
        console.warn("Kurdish TTS failed, falling back to browser speech synthesis");
        // Don't return early - fall through to browser speech synthesis
      }
    }

    // Use browser speech synthesis as fallback or default
    useBrowserSpeech();
  }, [language, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
  };
}
