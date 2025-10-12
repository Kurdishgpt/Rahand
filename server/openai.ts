import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function streamChatCompletion(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      stream: true,
      max_completion_tokens: 8192,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
    
    onComplete();
  } catch (error) {
    onError(error as Error);
  }
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  if (!response.data?.[0]?.url) {
    throw new Error("No image URL returned from OpenAI");
  }

  return response.data[0].url;
}

export async function getChatCompletion(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages,
    max_completion_tokens: 8192,
  });

  return response.choices[0].message.content || "";
}
