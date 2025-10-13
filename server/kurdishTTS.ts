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

// Kurdish TTS voices available (based on kurdishtts.com)
export const KURDISH_VOICES = {
  male: [
    'SÎDAR', 'RÊBAZ', 'ŞAH', 'OMÎRZA', 'SERDAR', 'SÎRWAN', 'ÇEKDAR', 'RÊWAN',
    'TÎGRAN', 'VEJÎN', 'ZANA', 'BARAN', 'HAWAR', 'NEBEZ', 'ZANA', 'SERDAR',
    'ÇEKDAR', 'MÎRZA', 'RÊBAZ', 'ŞAHO', 'BAWER', 'ROJAN', 'ÇEKO', 'DÎYAR',
    'KOVAN', 'MÎRZA', 'NÎJAD', 'HAWAR', 'JÎWAN', 'LÎRAN', 'MÎRZA', 'NÛHAT',
    'PÎROZ', 'RÊZAN', 'ŞÊRVAN', 'ARGEŞ', 'KOVAN', 'MÎRZA'
  ],
  female: [
    'ARA', 'BERFÎN', 'DÎLAN', 'EVAR', 'HÊVÎ', 'JÎYAN', 'NÎGAR', 'RONAK',
    'ŞÎLAN', 'ZÎLAN', 'AVAN', 'BÊRÎVAN', 'CÎHAN', 'DELAL', 'ÊVAR', 'GONA',
    'HÊLÎN', 'JÎNDA', 'KOVAN', 'LAVA', 'MÎNA', 'NAVÎN', 'PÊŞENG', 'ROZA',
    'SÎPAN', 'TARA', 'VÎYAN'
  ]
};

export async function generateKurdishTTS(request: KurdishTTSRequest): Promise<KurdishTTSResponse> {
  // Kurdish TTS API is currently not available - the service endpoints are not configured
  // This feature is disabled until a valid Kurdish TTS service is integrated
  return { 
    error: 'Kurdish TTS API is not currently available. Please use the browser\'s built-in speech instead by disabling "Use Kurdish API" in settings.' 
  };
  
  /* Disabled until valid API endpoints are configured
  const apiKey = process.env.KURDISH_TTS_API_KEY;
  
  if (!apiKey) {
    return { 
      error: 'Kurdish TTS API key not configured. Please add KURDISH_TTS_API_KEY to use this feature.' 
    };
  }

  try {
    // Try multiple potential API endpoints for Kurdish TTS
    const apiEndpoints = [
      'https://api.kurdishtts.com/v1/synthesize',
      'https://api.kurdishtts.com/api/tts',
      'https://kurdishtts.com/api/v1/tts',
    ];

    let lastError: Error | null = null;

    for (const apiUrl of apiEndpoints) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey, // Some APIs use this header instead
          },
          body: JSON.stringify({
            text: request.text,
            voice: request.voice,
            speaker: request.voice, // Some APIs use 'speaker' instead of 'voice'
            speed: request.speed || 1.0,
            rate: request.speed || 1.0, // Some APIs use 'rate' instead of 'speed'
            dialect: request.dialect || 'sorani',
            language: 'ku',
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

        lastError = new Error(`API returned ${response.status}`);
      } catch (err) {
        lastError = err as Error;
        continue; // Try next endpoint
      }
    }

    // If all endpoints failed, return error
    console.error('All Kurdish TTS API endpoints failed:', lastError);
    return { 
      error: 'Kurdish TTS API is currently unavailable. The service may be under maintenance. Please use the browser\'s built-in speech instead (disable Kurdish API in settings).' 
    };
  } catch (error) {
    console.error('Kurdish TTS error:', error);
    return { 
      error: 'Failed to connect to Kurdish TTS service. Please try again later or use browser speech synthesis.' 
    };
  }
  */
}

export function getAllVoices() {
  return {
    male: KURDISH_VOICES.male,
    female: KURDISH_VOICES.female,
    all: [...KURDISH_VOICES.male, ...KURDISH_VOICES.female]
  };
}
