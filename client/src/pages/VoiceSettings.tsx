import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const KURDISH_EXAMPLES = [
  "سڵاو، چۆنی؟ من پرۆزەیەم بۆ تاقیکردنەوەی قسە.",
  "ئەم، ئەمە نموونەیەکە بۆ تاقیکردنەوەی دەنگەکەم.",
  "پێم، خۆش به‌ یێتی بینینت، چۆن یارمەتیت پێ بدەم؟",
];

const ENGLISH_EXAMPLES = [
  "Hello, how are you? I am testing the text-to-speech feature.",
  "This is an example sentence to test the voice quality.",
  "Nice to meet you, how can I help you today?",
];

type GenderFilter = "all" | "male" | "female";

export default function VoiceSettings() {
  const { language, t } = useLanguage();
  
  const [autoPlayTTS, setAutoPlayTTS] = useState(() => {
    const stored = localStorage.getItem("autoPlayTTS");
    return stored === "true";
  });
  
  const [autoSendVoice, setAutoSendVoice] = useState(() => {
    const stored = localStorage.getItem("autoSendVoice");
    return stored === "true";
  });
  
  const [useKurdishAPI, setUseKurdishAPI] = useState(() => {
    const stored = localStorage.getItem("useKurdishAPI");
    return stored === "true";
  });
  
  const [selectedVoice, setSelectedVoice] = useState(() => {
    return localStorage.getItem("kurdishVoice") || "SÎDAR";
  });
  
  const [speed, setSpeed] = useState(() => {
    const stored = localStorage.getItem("voiceSpeed");
    return stored ? parseFloat(stored) : 0.9;
  });
  
  const [pitch, setPitch] = useState(() => {
    const stored = localStorage.getItem("voicePitch");
    return stored ? parseFloat(stored) : 1.0;
  });
  
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem("voiceVolume");
    return stored ? parseFloat(stored) : 1.0;
  });

  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [customText, setCustomText] = useState("");
  const [selectedExample, setSelectedExample] = useState("");

  const { data: voices } = useQuery<{ male: string[], female: string[] }>({
    queryKey: language === "ku" ? ['/api/kurdish-voices'] : ['/api/english-voices'],
    enabled: language === "ku" ? useKurdishAPI : true,
  });

  const { isSpeaking, speak, stop } = useTextToSpeech({
    language,
  });

  const handleAutoPlayToggle = (checked: boolean) => {
    setAutoPlayTTS(checked);
    localStorage.setItem("autoPlayTTS", checked.toString());
  };

  const handleAutoSendVoiceToggle = (checked: boolean) => {
    setAutoSendVoice(checked);
    localStorage.setItem("autoSendVoice", checked.toString());
  };

  const handleUseKurdishAPIToggle = (checked: boolean) => {
    setUseKurdishAPI(checked);
    localStorage.setItem("useKurdishAPI", checked.toString());
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    localStorage.setItem("kurdishVoice", voice);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
    localStorage.setItem("voiceSpeed", value[0].toString());
  };

  const handlePitchChange = (value: number[]) => {
    setPitch(value[0]);
    localStorage.setItem("voicePitch", value[0].toString());
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    localStorage.setItem("voiceVolume", value[0].toString());
  };

  const handleTestVoice = () => {
    if (isSpeaking) {
      stop();
    } else {
      const testText = language === "en" ? t("sampleText") : t("sampleTextKurdish");
      speak(testText);
    }
  };

  const handleGenerateSpeech = () => {
    if (isSpeaking) {
      stop();
    } else {
      const textToSpeak = customText.trim() || selectedExample;
      if (textToSpeak) {
        speak(textToSpeak);
      }
    }
  };

  const handleExampleSelect = (value: string) => {
    setSelectedExample(value);
    if (value && value !== "none") {
      setCustomText(value);
    }
  };

  const getFilteredVoices = () => {
    if (!voices) return [];
    
    if (genderFilter === "male") {
      return voices.male.map(v => ({ name: v, gender: "male" as const }));
    } else if (genderFilter === "female") {
      return voices.female.map(v => ({ name: v, gender: "female" as const }));
    }
    
    return [
      ...voices.male.map(v => ({ name: v, gender: "male" as const })),
      ...voices.female.map(v => ({ name: v, gender: "female" as const }))
    ];
  };

  const isVoiceMale = (voiceName: string) => {
    return voices?.male?.includes(voiceName);
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">
              {t("voiceSettings")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === "en" 
                ? "Configure text-to-speech settings" 
                : "ڕێکخستنی تایبەتمەندییەکانی دەنگی دەق"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Voice Selection" : "هەڵبژاردنی دەنگ"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Choose a voice and test text-to-speech" 
                : "دەنگێک هەڵبژێرە و دەنگی دەق تاقی بکەرەوە"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {language === "ku" && (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="use-kurdish-api" className="text-base">
                    {t("useKurdishAPI")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    چالاککردنی دەنگە ڕەسەنە کوردییەکان لە kurdishtts.com
                  </p>
                </div>
                <Switch
                  id="use-kurdish-api"
                  checked={useKurdishAPI}
                  onCheckedChange={handleUseKurdishAPIToggle}
                  data-testid="switch-kurdish-api"
                />
              </div>
            )}

            {((language === "ku" && useKurdishAPI && voices) || language === "en") && (
              <div className="space-y-6">
                {voices && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-base">
                        {language === "en" ? "Select Voice:" : "هەڵبژاردنی دەنگ:"}
                      </Label>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant={genderFilter === "all" ? "default" : "outline"}
                          onClick={() => setGenderFilter("all")}
                          data-testid="button-gender-all"
                          className="min-w-[120px]"
                        >
                          {language === "en" ? "All" : "هەموو"} ({voices.male.length + voices.female.length})
                        </Button>
                        <Button
                          variant={genderFilter === "male" ? "default" : "outline"}
                          onClick={() => setGenderFilter("male")}
                          data-testid="button-gender-male"
                          className="min-w-[120px]"
                        >
                          {language === "en" ? "Male" : "نێر"} ({voices.male.length})
                        </Button>
                        <Button
                          variant={genderFilter === "female" ? "default" : "outline"}
                          onClick={() => setGenderFilter("female")}
                          data-testid="button-gender-female"
                          className="min-w-[120px]"
                        >
                          {language === "en" ? "Female" : "مێ"} ({voices.female.length})
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                        {getFilteredVoices().map((voice) => (
                          <Button
                            key={voice.name}
                            variant={selectedVoice === voice.name ? "default" : "outline"}
                            onClick={() => handleVoiceChange(voice.name)}
                            data-testid={`button-voice-${voice.name}`}
                            className={cn(
                              "text-sm font-medium",
                              selectedVoice === voice.name && "ring-2 ring-primary"
                            )}
                          >
                            {voice.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <Label className="text-base">
                    {language === "en" ? "Enter Text:" : "دەقی کوردی بنووسە:"}
                  </Label>
                  <div className="relative">
                    <Textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder={language === "en" 
                        ? "Type text here to test the voice..." 
                        : "دەقی کوردی لێرە بنووسە بۆ تاقیکردنەوەی دەنگ..."}
                      rows={4}
                      maxLength={150}
                      data-testid="textarea-custom-text"
                      className="resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {customText.length}/150
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">
                    {language === "en" ? "Example Sentences:" : "ڕستە نموونەییەکان:"}
                  </Label>
                  <Select value={selectedExample} onValueChange={handleExampleSelect}>
                    <SelectTrigger data-testid="select-example">
                      <SelectValue placeholder={language === "en" ? "-- Select an example --" : "-- نموونەیەک هەڵبژێرە --"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        {language === "en" ? "-- Select an example --" : "-- نموونەیەک هەڵبژێرە --"}
                      </SelectItem>
                      {(language === "en" ? ENGLISH_EXAMPLES : KURDISH_EXAMPLES).map((sentence, index) => (
                        <SelectItem key={index} value={sentence}>
                          {sentence.substring(0, 50)}{sentence.length > 50 ? "..." : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerateSpeech}
                  variant={isSpeaking ? "destructive" : "default"}
                  className="w-full"
                  data-testid="button-generate-speech"
                  disabled={!customText.trim() && !selectedExample}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-4 w-4 mr-2" />
                      {language === "en" ? "Stop Speech" : "وەستاندنی دەنگ"}
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      {language === "en" ? "Generate Speech" : "دروستکردنی دەنگ"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("textToSpeech")}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Control how AI responses are read aloud"
                : "کۆنترۆڵکردنی چۆنیەتی خوێندنەوەی وەڵامەکانی AI"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-play" className="text-base">
                  {t("autoPlayResponses")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("autoPlayDescription")}
                </p>
              </div>
              <Switch
                id="auto-play"
                checked={autoPlayTTS}
                onCheckedChange={handleAutoPlayToggle}
                data-testid="switch-autoplay"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-send" className="text-base">
                  {t("autoSendVoice")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("autoSendVoiceDescription")}
                </p>
              </div>
              <Switch
                id="auto-send"
                checked={autoSendVoice}
                onCheckedChange={handleAutoSendVoiceToggle}
                data-testid="switch-auto-send"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">{t("voiceSpeed")}</Label>
                <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={handleSpeedChange}
                min={0.5}
                max={2.0}
                step={0.1}
                data-testid="slider-speed"
              />
            </div>

            {!useKurdishAPI && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">{t("voicePitch")}</Label>
                    <span className="text-sm text-muted-foreground">{pitch.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[pitch]}
                    onValueChange={handlePitchChange}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    data-testid="slider-pitch"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">{t("voiceVolume")}</Label>
                    <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    min={0}
                    max={1}
                    step={0.1}
                    data-testid="slider-volume"
                  />
                </div>
              </>
            )}

            <div className="pt-4">
              <Button
                onClick={handleTestVoice}
                variant={isSpeaking ? "destructive" : "default"}
                className="w-full"
                data-testid="button-test-voice"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    {t("stopSpeaking")}
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t("testVoice")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "How to Use Voice Features" : "چۆنیەتی بەکارهێنانی تایبەتمەندییەکانی دەنگ"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">
                {language === "en" ? "Voice Input (Speech-to-Text)" : "هاتنەژوورەوەی دەنگ (دەنگ بۆ دەق)"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Click the microphone button in the chat input to speak your message. Enable 'Auto-Send' above to automatically send messages after voice input."
                  : "کرتە بکە لەسەر دوگمەی مایکرۆفۆن لە هاتنەژوورەوەی گفتوگۆ بۆ قسەکردنی پەیامەکەت. 'خۆکار ناردن' چالاک بکە بۆ ناردنی خۆکاری پەیام دوای دەنگ."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">
                {language === "en" ? "Voice Output (Text-to-Speech)" : "دەرچوونی دەنگ (دەق بۆ دەنگ)"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Enable 'Auto-Play AI Responses' to have responses read aloud automatically. For Kurdish, enable 'Use Kurdish TTS API' for authentic voices."
                  : "چالاککردنی 'خۆکار لێدانی وەڵامەکان' بۆ خوێندنەوەی خۆکاری وەڵامەکان. بۆ کوردی، 'بەکارهێنانی API ی دەنگی کوردی' چالاک بکە بۆ دەنگی ڕەسەن."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
