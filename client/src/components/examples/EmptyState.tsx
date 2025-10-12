import { EmptyState } from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="h-screen">
      <EmptyState onSuggestedPrompt={(prompt) => console.log("Selected:", prompt)} />
    </div>
  );
}
