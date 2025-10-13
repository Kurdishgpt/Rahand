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
  const apiKey = process.env.KURDISH_TTS_API_KEY;
  
  if (!apiKey) {
    return { 
      error: 'Kurdish TTS API key not configured. Using browser speech synthesis instead.' 
    };
  }

  try {
    // Try multiple potential API endpoints for KurdishTTS.com
    const apiEndpoints = [
      'https://api.kurdishtts.com/v1/synthesize',
      'https://api.kurdishtts.com/v1/tts',
      'https://api.kurdishtts.com/api/tts',
      'https://kurdishtts.com/api/v1/tts',
      'https://kurdishtts.com/api/synthesize',
    ];

    let lastError: Error | null = null;

    for (const apiUrl of apiEndpoints) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
          },
          body: JSON.stringify({
            text: request.text,
            voice: request.voice,
            speed: request.speed || 1.0,
            dialect: request.dialect || 'sorani',
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          
          // Handle JSON response (with URL)
          if (contentType?.includes('application/json')) {
            const data = await response.json();
            return { audioUrl: data.audioUrl || data.url || data.audio_url };
          }
          
          // Handle direct audio response
          if (contentType?.includes('audio/')) {
            const arrayBuffer = await response.arrayBuffer();
            const base64Audio = Buffer.from(arrayBuffer).toString('base64');
            return { audioData: `data:${contentType};base64,${base64Audio}` };
          }
        }

        lastError = new Error(`API returned ${response.status}: ${response.statusText}`);
      } catch (err) {
        lastError = err as Error;
        continue; // Try next endpoint
      }
    }

    // If all endpoints failed, return error
    console.error('All Kurdish TTS API endpoints failed:', lastError);
    return { 
      error: 'Unable to connect to KurdishTTS API. The API endpoint may be incorrect. To use the Kurdish API, please get the correct endpoint URL from your KurdishTTS.com account documentation. Using browser speech synthesis instead.' 
    };
  } catch (error) {
    console.error('Kurdish TTS error:', error);
    return { 
      error: 'Failed to connect to Kurdish TTS service. Please try again later or use browser speech synthesis.' 
    };
  }
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
