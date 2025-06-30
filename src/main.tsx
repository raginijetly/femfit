import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

// Create a simple application wrapper
const AppWithProviders = () => {
  return (
    // <ThemeProvider attribute="class">
    <TooltipProvider>
      <App />
    </TooltipProvider>
    //  </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithProviders />);
