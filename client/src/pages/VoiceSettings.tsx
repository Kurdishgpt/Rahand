import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/hooks/useLanguage";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Link } from "wouter";

export default function VoiceSettings() {
  const { language, t } = useLanguage();
  const [autoPlayTTS, setAutoPlayTTS] = useState(() => {
    const stored = localStorage.getItem("autoPlayTTS");
    return stored === "true";
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

  const { isSpeaking, speak, stop } = useTextToSpeech({
    language,
  });

  const handleAutoPlayToggle = (checked: boolean) => {
    setAutoPlayTTS(checked);
    localStorage.setItem("autoPlayTTS", checked.toString());
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
                  ? "Click the microphone button in the chat input to speak your message instead of typing."
                  : "کرتە بکە لەسەر دوگمەی مایکرۆفۆن لە هاتنەژوورەوەی گفتوگۆ بۆ قسەکردنی پەیامەکەت لە جیاتی نووسین."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">
                {language === "en" ? "Voice Output (Text-to-Speech)" : "دەرچوونی دەنگ (دەق بۆ دەنگ)"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Enable 'Auto-Play AI Responses' above to have the AI's responses read aloud automatically. You can also test the voice with different settings."
                  : "چالاککردنی 'خۆکار لێدانی وەڵامەکان' لە سەرەوە بۆ خوێندنەوەی خۆکاری وەڵامەکانی AI. هەروەها دەتوانیت دەنگ تاقی بکەیتەوە بە ڕێکخستنی جیاواز."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
