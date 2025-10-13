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
export const KURDISH_VOICES = {
  male: [
    'SÎDAR', 'RÊBAZ', 'ŞAH', 'OMÎRZA', 'SERDAR', 'SÎRWAN', 'ÇEKDAR', 'RÊWAN',
    'TÎGRAN', 'VEJÎN', 'ZANA', 'BARAN', 'HAWAR', 'NEBEZ', 'ŞAHO', 'BAWER',
    'ROJAN', 'ÇEKO', 'DÎYAR', 'KOVAN', 'MÎRZA', 'NÎJAD', 'JÎWAN', 'LÎRAN',
    'NÛHAT', 'PÎROZ', 'RÊZAN', 'ŞÊRVAN', 'ARGEŞ'
  ],
  female: [
    'ARA', 'BERFÎN', 'DÎLAN', 'EVAR', 'HÊVÎ', 'JÎYAN', 'NÎGAR', 'RONAK',
    'ŞÎLAN', 'ZÎLAN', 'AVAN', 'BÊRÎVAN', 'CÎHAN', 'DELAL', 'ÊVAR', 'GONA',
    'HÊLÎN', 'JÎNDA', 'LAVA', 'MÎNA', 'NAVÎN', 'PÊŞENG', 'ROZA',
    'SÎPAN', 'TARA', 'VÎYAN'
  ]
};

export async function generateKurdishTTS(request: KurdishTTSRequest): Promise<KurdishTTSResponse> {
  const apiKey = process.env.KURDISH_TTS_API_KEY;
  
  if (!apiKey) {
    return { 
      error: 'Kurdish TTS API key not configured. Please add KURDISH_TTS_API_KEY to use this feature.' 
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
      error: 'Kurdish TTS API is currently unavailable. The service may be under maintenance. Please use the browser\'s built-in speech instead (disable Kurdish API in settings).' 
    };
  } catch (error) {
    console.error('Kurdish TTS error:', error);
    return { 
      error: 'Failed to connect to Kurdish TTS service. Please try again later or use browser speech synthesis.' 
    };
  }
}

export function getAllVoices() {
  return {
    male: KURDISH_VOICES.male,
    female: KURDISH_VOICES.female,
    all: [...KURDISH_VOICES.male, ...KURDISH_VOICES.female]
  };
}
