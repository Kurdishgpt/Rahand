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
    kurdish: "Kurdish",
    english: "English",
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
    kurdish: "کوردی",
    english: "ئینگلیزی",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
