import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { streamChatCompletion, generateImage, getChatCompletion } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat completion endpoint with streaming
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, language } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Add system message for Kurdish support
      const systemMessage = {
        role: "system" as const,
        content: language === "ku" 
          ? "You are a helpful AI assistant that can communicate fluently in Kurdish Central (Sorani) and English. When responding in Kurdish, use proper Sorani script. Be helpful, accurate, and friendly."
          : "You are a helpful AI assistant that can communicate fluently in Kurdish Central (Sorani) and English. Be helpful, accurate, and friendly."
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

  const httpServer = createServer(app);

  return httpServer;
}
