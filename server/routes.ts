import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { streamChatCompletion, generateImage, getChatCompletion } from "./openai";
import { generateKurdishTTS, getAllVoices } from "./kurdishTTS";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat completion endpoint with streaming
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, language } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Add system message for language-specific responses
      const systemMessage = {
        role: "system" as const,
        content: language === "ku" 
          ? "You are a helpful AI assistant. You MUST respond ONLY in Kurdish Central (Sorani/سۆرانی). Use the Kurdish Arabic script (ک، گ، چ، پ، ژ، ڵ، ڕ، ێ، ۆ، وو، ئ). Every single word in your response must be in Kurdish. Never use English, Arabic, or any other language. Example: سڵاو (hello), چۆنیت؟ (how are you). Be helpful, accurate, and friendly. Always respond completely in Kurdish Sorani."
          : "You are a helpful AI assistant. You MUST respond ONLY in English. Never mix Kurdish or any other language in your responses. Be helpful, accurate, and friendly. Always respond completely in English."
      };

      const fullMessages = [systemMessage, ...messages];

      // Set headers for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      await streamChatCompletion(
        fullMessages,
        (chunk) => {
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        },
        () => {
          res.write(`data: [DONE]\n\n`);
          res.end();
        },
        (error) => {
          console.error("Chat error:", error);
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
          res.end();
        }
      );
    } catch (error) {
      console.error("Chat endpoint error:", error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // Image generation endpoint
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const imageUrl = await generateImage(prompt);
      res.json({ imageUrl });
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Kurdish TTS endpoint
  app.options("/api/kurdish-tts", (req, res) => {
    res.status(200).end();
  });

  app.post("/api/kurdish-tts", async (req, res) => {
    try {
      const { text, voice, speed, dialect } = req.body;

      if (!text || typeof text !== "string") {
        console.error("Kurdish TTS: Missing or invalid text parameter");
        return res.status(400).json({ error: "Text is required" });
      }

      console.log(`Kurdish TTS request: text="${text.substring(0, 50)}...", voice=${voice || 'SÎDAR'}, dialect=${dialect || 'sorani'}`);

      const result = await generateKurdishTTS({
        text,
        voice: voice || 'SÎDAR',
        speed: speed || 1.0,
        dialect: dialect || 'sorani'
      });

      // Check for error in result
      if (result.error) {
        console.warn(`Kurdish TTS API error: ${result.error}`);
        return res.status(503).json({ 
          error: result.error,
          fallback: true
        });
      }

      // If we have audioData, send it as blob
      if (result.audioData) {
        const base64Data = result.audioData.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', buffer.length.toString());
        console.log(`Kurdish TTS: Sending audio data (${buffer.length} bytes)`);
        return res.send(buffer);
      } else if (result.audioUrl) {
        // Fetch from URL and stream
        console.log(`Kurdish TTS: Fetching audio from URL: ${result.audioUrl}`);
        const audioResponse = await fetch(result.audioUrl);
        
        if (!audioResponse.ok) {
          console.error(`Kurdish TTS: Failed to fetch audio from URL (${audioResponse.status})`);
          return res.status(503).json({ 
            error: 'Failed to fetch audio from TTS service',
            fallback: true
          });
        }
        
        const audioBuffer = await audioResponse.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.byteLength.toString());
        console.log(`Kurdish TTS: Sending audio from URL (${audioBuffer.byteLength} bytes)`);
        return res.send(Buffer.from(audioBuffer));
      } else {
        console.error("Kurdish TTS: No audio data or URL received");
        return res.status(503).json({ 
          error: 'No audio data received from TTS API',
          fallback: true
        });
      }
    } catch (error) {
      console.error("Kurdish TTS endpoint error:", error);
      return res.status(503).json({ 
        error: "Failed to generate Kurdish speech",
        fallback: true
      });
    }
  });

  // Get available Kurdish voices
  app.get("/api/kurdish-voices", async (req, res) => {
    try {
      const voices = getAllVoices();
      res.json(voices);
    } catch (error) {
      console.error("Get voices error:", error);
      res.status(500).json({ error: "Failed to get voices" });
    }
  });

  // Get available English voices (browser-based)
  app.get("/api/english-voices", async (req, res) => {
    try {
      // Common English voice names for different browsers/systems
      const voices = {
        male: [
          'David', 'Daniel', 'George', 'James', 'Mark', 'Paul',
          'Richard', 'Thomas', 'William', 'Alex', 'Bruce', 'Fred'
        ],
        female: [
          'Alice', 'Samantha', 'Victoria', 'Karen', 'Susan', 'Fiona',
          'Kate', 'Zira', 'Hazel', 'Moira', 'Tessa', 'Veena'
        ]
      };
      res.json(voices);
    } catch (error) {
      console.error("Get English voices error:", error);
      res.status(500).json({ error: "Failed to get English voices" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
