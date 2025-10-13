import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ku";

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    newChat: "New Chat",
    chatHistory: "Chat History",
    settings: "Settings",
    typePlaceholder: "Type your message...",
    generating: "Generating...",
    listening: "Listening...",
    speaking: "Speaking...",
    generateImage: "Generate Image",
    imagePrompt: "Describe the image you want to create...",
    send: "Send",
    voiceInput: "Voice Input",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    kurdish: "کوردی (Central Kurdish)",
    english: "English",
    welcomeTitle: "Welcome to AI Chat",
    welcomeSubtitle: "Start a conversation in English or Kurdish, use voice commands, or generate images",
    suggestedPrompt1: "Tell me about Kurdish culture",
    suggestedPrompt2: "How can I use voice features?",
    suggestedPrompt3: "Generate a beautiful landscape",
    thinking: "Thinking...",
    imageModeActive: "Image generation mode active",
    home: "Home",
    voiceSettings: "Voice Settings",
    textToSpeech: "Text to Speech",
    autoPlayResponses: "Auto-Play AI Responses",
    autoPlayDescription: "Automatically read AI responses aloud",
    testVoice: "Test Voice",
    stopSpeaking: "Stop Speaking",
    sampleText: "Hello! This is a test of the text-to-speech feature.",
    sampleTextKurdish: "سڵاو! ئەمە تاقیکردنەوەی تایبەتمەندی دەنگە.",
    voiceSpeed: "Voice Speed",
    voicePitch: "Voice Pitch",
    voiceVolume: "Voice Volume",
    voiceCharacter: "Voice Character",
    selectVoice: "Select Voice",
    maleVoices: "Male Voices",
    femaleVoices: "Female Voices",
    autoSendVoice: "Auto-Send Voice Messages",
    autoSendVoiceDescription: "Automatically send message after voice input",
    kurdishVoiceAPI: "Kurdish Voice (API)",
    useKurdishAPI: "Use Kurdish TTS API",
    useKurdishAPIDescription: "Use kurdishtts.com for authentic Kurdish voices",
  },
  ku: {
    newChat: "گفتوگۆی نوێ",
    chatHistory: "مێژووی گفتوگۆ",
    settings: "ڕێکخستنەکان",
    typePlaceholder: "پەیامەکەت بنووسە...",
    generating: "دروستکردن...",
    listening: "گوێگرتن...",
    speaking: "قسەکردن...",
    generateImage: "دروستکردنی وێنە",
    imagePrompt: "وێنەکە باس بکە کە دەتەوێت دروستی بکەیت...",
    send: "ناردن",
    voiceInput: "دەنگ",
    darkMode: "دۆخی تاریک",
    lightMode: "دۆخی ڕووناک",
    kurdish: "کوردی ناوەندی",
    english: "ئینگلیزی",
    welcomeTitle: "بەخێربێیت بۆ گفتوگۆی AI",
    welcomeSubtitle: "گفتوگۆ دەست پێ بکە بە کوردی یان ئینگلیزی، فەرمانی دەنگی بەکاربهێنە، یان وێنە دروست بکە",
    suggestedPrompt1: "باسی کلتووری کوردی بکە",
    suggestedPrompt2: "چۆن دەتوانم تایبەتمەندی دەنگ بەکاربهێنم؟",
    suggestedPrompt3: "دیمەنێکی جوان دروست بکە",
    thinking: "بیردەکاتەوە...",
    imageModeActive: "دۆخی دروستکردنی وێنە چالاکە",
    home: "ماڵەوە",
    voiceSettings: "ڕێکخستنەکانی دەنگ",
    textToSpeech: "دەنگی دەق",
    autoPlayResponses: "خۆکار لێدانی وەڵامەکان",
    autoPlayDescription: "خۆکار خوێندنەوەی وەڵامەکانی AI",
    testVoice: "تاقیکردنەوەی دەنگ",
    stopSpeaking: "وەستاندنی قسەکردن",
    sampleText: "سڵاو! ئەمە تاقیکردنەوەی تایبەتمەندی دەنگە.",
    sampleTextKurdish: "سڵاو! ئەمە تاقیکردنەوەی تایبەتمەندی دەنگە.",
    voiceSpeed: "خێرایی دەنگ",
    voicePitch: "بەرزی دەنگ",
    voiceVolume: "بەرزی دەنگ",
    voiceCharacter: "کاراکتەری دەنگ",
    selectVoice: "دەنگ هەڵبژێرە",
    maleVoices: "دەنگی پیاوان",
    femaleVoices: "دەنگی ژنان",
    autoSendVoice: "خۆکار ناردنی پەیامە دەنگییەکان",
    autoSendVoiceDescription: "خۆکار ناردنی پەیام دوای دەنگ",
    kurdishVoiceAPI: "دەنگی کوردی (API)",
    useKurdishAPI: "بەکارهێنانی API ی دەنگی کوردی",
    useKurdishAPIDescription: "بەکارهێنانی kurdishtts.com بۆ دەنگی ڕەسەنی کوردی",
  },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return (stored as Language) || "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("dir", language === "ku" ? "rtl" : "ltr");
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ku" : "en"));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
