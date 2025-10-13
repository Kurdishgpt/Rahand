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
  const apiKey = process.env.KURDISH_TTS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Kurdish TTS API key not configured');
  }

  try {
    // KurdishTTS.com API endpoint (you may need to adjust based on actual API docs)
    const apiUrl = 'https://api.kurdishtts.com/v1/tts';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: request.text,
        voice: request.voice,
        speed: request.speed || 1.0,
        dialect: request.dialect || 'sorani',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kurdish TTS API error:', response.status, errorText);
      throw new Error(`Kurdish TTS API error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    
    // Handle JSON response (with URL)
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return { audioUrl: data.audioUrl || data.url };
    }
    
    // Handle direct audio response
    if (contentType?.includes('audio/')) {
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');
      return { audioData: `data:${contentType};base64,${base64Audio}` };
    }

    throw new Error('Unexpected response format from Kurdish TTS API');
  } catch (error) {
    console.error('Kurdish TTS error:', error);
    throw error;
  }
}

export function getAllVoices() {
  return {
    male: KURDISH_VOICES.male,
    female: KURDISH_VOICES.female,
    all: [...KURDISH_VOICES.male, ...KURDISH_VOICES.female]
  };
}
