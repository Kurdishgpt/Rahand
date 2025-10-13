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
    // Kurdish TTS API is disabled - always use browser speech synthesis
    // const useKurdishAPI = localStorage.getItem("useKurdishAPI") === "true";
    
    /* Kurdish API disabled until valid service is available
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
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          
          // If API is unavailable (503), fall back to browser speech
          if (response.status === 503) {
            console.warn("Kurdish TTS API unavailable, falling back to browser speech");
            onError?.("Kurdish TTS API is unavailable. Using browser speech. Disable 'Use Kurdish API' in settings to stop seeing this message.");
            
            // Don't return here - fall through to browser speech synthesis
          } else {
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
            setIsSpeaking(false);
            onError?.("Failed to play Kurdish audio");
            URL.revokeObjectURL(audioUrl);
          };
          
          await audio.play();
          return;
        }
      } catch (error) {
        console.error("Kurdish TTS error:", error);
        setIsSpeaking(false);
        onError?.(error instanceof Error ? error.message : "Kurdish TTS failed");
        return;
      }
    }
    */

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
