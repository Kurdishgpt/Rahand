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
  // Note: KurdishTTS.com does not have publicly available API endpoints
  // The app will use browser-based speech synthesis for Kurdish instead
  // If you have a working Kurdish TTS API with documentation, update this function with:
  // 1. The correct API endpoint URL
  // 2. The proper request/response format from the API documentation
  
  return { 
    error: 'Kurdish TTS API not available. Using browser speech synthesis instead.' 
  };
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
