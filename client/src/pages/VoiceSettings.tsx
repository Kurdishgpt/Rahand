import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

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

  const { data: voices } = useQuery<{ male: string[], female: string[] }>({
    queryKey: ['/api/kurdish-voices'],
    enabled: useKurdishAPI,
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

        {language === "ku" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("kurdishVoiceAPI")}</CardTitle>
              <CardDescription>
                {t("useKurdishAPIDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {useKurdishAPI && (
                <div className="space-y-4">
                  <Label className="text-base">{t("voiceCharacter")}</Label>
                  <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                    <SelectTrigger data-testid="select-voice">
                      <SelectValue placeholder={t("selectVoice")} />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-sm font-semibold">{t("maleVoices")}</div>
                      {voices?.male?.map((voice: string) => (
                        <SelectItem key={voice} value={voice}>
                          {voice}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-sm font-semibold mt-2">{t("femaleVoices")}</div>
                      {voices?.female?.map((voice: string) => (
                        <SelectItem key={voice} value={voice}>
                          {voice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                    <VolumeX className="h-4 w-4" />
                    {t("stopSpeaking")}
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
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
