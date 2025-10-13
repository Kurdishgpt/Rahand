interface KurdishTTSRequest {
  text: string;
  voice: string;
  speed?: number;
  dialect?: 'sorani' | 'kurmanji';
}

interface KurdishTTSResponse {
  audioUrl?: string;
  audioData?: string;
  error?: string;
}

// Kurdish TTS FREE voices available from kurdishtts.com (only free tier voices)
// Free tier includes: 1 male + 1 female voice per dialect (Sorani & Kurmanji)
export const KURDISH_VOICES = {
  sorani: {
    male: ['SÎDAR'],
    female: ['ARA']
  },
  kurmanji: {
    male: ['BARAN'],
    female: ['BERFÎN']
  }
};

export async function generateKurdishTTS(request: KurdishTTSRequest): Promise<KurdishTTSResponse> {
  // Note: External Kurdish TTS API is currently unavailable/non-functional
  // Browser speech synthesis is used as the primary method
  return { 
    error: 'Using browser speech synthesis for Kurdish text-to-speech.' 
  };

  /* Disabled: External API not working (returns 405)
  const apiKey = process.env.KURDISH_TTS_API_KEY;
  
  if (!apiKey) {
    return { 
      error: 'Kurdish TTS API key not configured. Using browser speech synthesis instead.' 
    };
  }

  try {
    const apiUrl = "https://api.kurdishtts.com/v1/tts";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        text: request.text, 
        voice: request.voice || "SÎDAR" 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kurdish TTS API error:', response.status, errorText);
      return { 
        error: `Kurdish TTS API error (${response.status}). Using browser speech synthesis instead.` 
      };
    }

    const data = await response.json() as { audioUrl?: string };
    
    if (data.audioUrl) {
      return { audioUrl: data.audioUrl };
    } else {
      return { 
        error: 'No audio URL received from Kurdish TTS API. Using browser speech synthesis instead.' 
      };
    }

  } catch (error) {
    console.error("Kurdish TTS error:", error);
    return { 
      error: 'Failed to connect to Kurdish TTS service. Using browser speech synthesis instead.' 
    };
  }
  */
}

export function getAllVoices() {
  const allMale = [...KURDISH_VOICES.sorani.male, ...KURDISH_VOICES.kurmanji.male];
  const allFemale = [...KURDISH_VOICES.sorani.female, ...KURDISH_VOICES.kurmanji.female];
  
  return {
    male: allMale,
    female: allFemale,
    all: [...allMale, ...allFemale],
    byDialect: KURDISH_VOICES
  };
}
