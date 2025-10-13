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
  // KurdishTTS.com API is not publicly available
  // Using browser speech synthesis instead
  return { 
    error: 'Using browser speech synthesis for Kurdish TTS.' 
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
