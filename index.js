// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/openai.ts
import Groq from "groq-sdk";
import OpenAI from "openai";
var groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
async function streamChatCompletion(messages, onChunk, onComplete, onError) {
  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      stream: true,
      max_tokens: 8192
    });
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
    onComplete();
  } catch (error) {
    onError(error);
  }
}
async function generateImage(prompt) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard"
  });
  if (!response.data?.[0]?.url) {
    throw new Error("No image URL returned from OpenAI");
  }
  return response.data[0].url;
}

// server/kurdishTTS.ts
var KURDISH_VOICES = {
  sorani: {
    male: ["Antoni", "Josh", "Arnold", "Callum"],
    female: ["Rachel", "Domi", "Bella", "Elli", "Emily"]
  },
  kurmanji: {
    male: ["Antoni", "Josh", "Arnold", "Sam"],
    female: ["Rachel", "Domi", "Bella", "Charlotte"]
  }
};
function getAllVoices() {
  const allMale = [...KURDISH_VOICES.sorani.male, ...KURDISH_VOICES.kurmanji.male];
  const allFemale = [...KURDISH_VOICES.sorani.female, ...KURDISH_VOICES.kurmanji.female];
  const uniqueMale = Array.from(new Set(allMale));
  const uniqueFemale = Array.from(new Set(allFemale));
  return {
    male: uniqueMale,
    female: uniqueFemale,
    all: [...uniqueMale, ...uniqueFemale],
    byDialect: KURDISH_VOICES
  };
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/chat", async (req, res) => {
    try {
      const { messages, language } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }
      const systemMessage = {
        role: "system",
        content: language === "ku" ? "You are a helpful AI assistant. You MUST respond ONLY in Kurdish Central (Sorani/\u0633\u06C6\u0631\u0627\u0646\u06CC). Use the Kurdish Arabic script (\u06A9\u060C \u06AF\u060C \u0686\u060C \u067E\u060C \u0698\u060C \u06B5\u060C \u0695\u060C \u06CE\u060C \u06C6\u060C \u0648\u0648\u060C \u0626). Every single word in your response must be in Kurdish. Never use English, Arabic, or any other language. Example: \u0633\u06B5\u0627\u0648 (hello), \u0686\u06C6\u0646\u06CC\u062A\u061F (how are you). Be helpful, accurate, and friendly. Always respond completely in Kurdish Sorani." : "You are a helpful AI assistant. You MUST respond ONLY in English. Never mix Kurdish or any other language in your responses. Be helpful, accurate, and friendly. Always respond completely in English."
      };
      const fullMessages = [systemMessage, ...messages];
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      await streamChatCompletion(
        fullMessages,
        (chunk) => {
          res.write(`data: ${JSON.stringify({ content: chunk })}

`);
        },
        () => {
          res.write(`data: [DONE]

`);
          res.end();
        },
        (error) => {
          console.error("Chat error:", error);
          res.write(`data: ${JSON.stringify({ error: error.message })}

`);
          res.end();
        }
      );
    } catch (error) {
      console.error("Chat endpoint error:", error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });
  app2.post("/api/generate-image", async (req, res) => {
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
  app2.options("/api/kurdish-tts", (req, res) => {
    res.status(200).end();
  });
  app2.post("/api/kurdish-tts", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }
      return res.status(503).json({
        error: "Using browser speech synthesis for Kurdish text-to-speech.",
        fallback: true
      });
    } catch (error) {
      console.error("Kurdish TTS endpoint error:", error);
      return res.status(503).json({
        error: "Failed to generate Kurdish speech",
        fallback: true
      });
    }
  });
  app2.get("/api/kurdish-voices", async (req, res) => {
    try {
      const voices = getAllVoices();
      res.json(voices);
    } catch (error) {
      console.error("Get voices error:", error);
      res.status(500).json({ error: "Failed to get voices" });
    }
  });
  app2.get("/api/english-voices", async (req, res) => {
    try {
      const voices = {
        male: [
          "David",
          "Daniel",
          "George",
          "James",
          "Mark",
          "Paul",
          "Richard",
          "Thomas",
          "William",
          "Alex",
          "Bruce",
          "Fred"
        ],
        female: [
          "Alice",
          "Samantha",
          "Victoria",
          "Karen",
          "Susan",
          "Fiona",
          "Kate",
          "Zira",
          "Hazel",
          "Moira",
          "Tessa",
          "Veena"
        ]
      };
      res.json(voices);
    } catch (error) {
      console.error("Get English voices error:", error);
      res.status(500).json({ error: "Failed to get English voices" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "docs"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
