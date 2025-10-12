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
