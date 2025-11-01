import { TiptapEditor } from "./components/editor/TiptapEditor";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <TiptapEditor autoFocus={true} />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
