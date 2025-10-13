interface KurdishTTSRequest {
  text: string;
  voice: string;
  speed?: number;
  dialect?: 'sorani' | 'kurmanji';
}

interface KurdishTTSResponse {
  audioUrl?: string;
  audioData?: string;
  audioBuffer?: ArrayBuffer;
  error?: string;
}

// ElevenLabs character voices for Kurdish TTS
// Using multilingual voices that can handle Kurdish text
export const KURDISH_VOICES = {
  sorani: {
    male: ['Antoni', 'Josh', 'Arnold', 'Callum'],
    female: ['Rachel', 'Domi', 'Bella', 'Elli', 'Emily']
  },
  kurmanji: {
    male: ['Antoni', 'Josh', 'Arnold', 'Sam'],
    female: ['Rachel', 'Domi', 'Bella', 'Charlotte']
  }
};

// ElevenLabs voice IDs (premade multilingual voices)
const ELEVENLABS_VOICE_IDS: Record<string, string> = {
  'Rachel': '21m00Tcm4TlvDq8ikWAM',
  'Domi': 'AZnzlk1XvdvUeBnXmlld',
  'Bella': 'EXAVITQu4vr4xnSDxMaL',
  'Antoni': 'ErXwobaYiN019PkySvjV',
  'Elli': 'MF3mGyEYCl7XYWbV9V6O',
  'Josh': 'TxGEqnHWrfWFTfGW9XjX',
  'Arnold': 'VR6AewLTigWG4xSOukaG',
  'Sam': 'yoZ06aMxZJJ28mfd3POQ',
  'Emily': 'LcfcDJNUP1GQjkzn1xUU',
  'Callum': 'N2lVS1w4EtoT3dr4eOWO',
  'Charlotte': 'XB0fDUnXU5powFXDhCwa'
};

export async function generateKurdishTTS(request: KurdishTTSRequest): Promise<KurdishTTSResponse> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    return { 
      error: 'ElevenLabs API key not configured. Using browser speech synthesis instead.' 
    };
  }

  try {
    // Get voice ID from voice name, default to Rachel
    const voiceId = ELEVENLABS_VOICE_IDS[request.voice] || ELEVENLABS_VOICE_IDS['Rachel'];
    
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        text: request.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS API error:', response.status, errorText);
      return { 
        error: `ElevenLabs API error (${response.status}). Using browser speech synthesis instead.` 
      };
    }

    const audioBuffer = await response.arrayBuffer();
    
    if (audioBuffer && audioBuffer.byteLength > 0) {
      return { audioBuffer };
    } else {
      return { 
        error: 'No audio data received from ElevenLabs API. Using browser speech synthesis instead.' 
      };
    }

  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    return { 
      error: 'Failed to connect to ElevenLabs service. Using browser speech synthesis instead.' 
    };
  }
}

export function getAllVoices() {
  const allMale = [...KURDISH_VOICES.sorani.male, ...KURDISH_VOICES.kurmanji.male];
  const allFemale = [...KURDISH_VOICES.sorani.female, ...KURDISH_VOICES.kurmanji.female];
  
  // Remove duplicates
  const uniqueMale = Array.from(new Set(allMale));
  const uniqueFemale = Array.from(new Set(allFemale));
  
  return {
    male: uniqueMale,
    female: uniqueFemale,
    all: [...uniqueMale, ...uniqueFemale],
    byDialect: KURDISH_VOICES
  };
}
