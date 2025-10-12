import { ChatMessage, Message } from "../ChatMessage";

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Hello! Can you help me learn Kurdish?",
    timestamp: new Date(),
  },
  {
    id: "2",
    role: "assistant",
    content: "Of course! I'd be happy to help you learn Kurdish. What would you like to know?",
    timestamp: new Date(),
  },
];

export default function ChatMessageExample() {
  return (
    <div className="p-4 space-y-4 max-w-4xl">
      {sampleMessages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <ChatMessage
        message={{
          id: "3",
          role: "assistant",
          content: "I'm typing...",
          timestamp: new Date(),
        }}
        isStreaming
      />
    </div>
  );
}
