import { ThemeProvider as Provider } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { useTheme } from "../ThemeProvider";

function ThemeDemo() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="p-8 space-y-4">
      <h3 className="text-xl font-semibold">Current theme: {theme}</h3>
      <Button onClick={toggleTheme}>Toggle Theme</Button>
    </div>
  );
}

export default function ThemeProviderExample() {
  return (
    <Provider>
      <ThemeDemo />
    </Provider>
  );
}
