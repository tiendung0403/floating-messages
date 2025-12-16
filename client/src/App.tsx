import sky from "./assets/sky.jpg";
import SkyBackground from "./components/SkyBackground";
import StarField from "./components/StarField";
import BubbleLayer from "./components/BubbleLayer";
import ChatDock from "./components/ChatDock"; 
import { useMessages } from "./hooks/useMessages";

export default function App() {
  const { messages, offlineDemo, loading, send } = useMessages(3500);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <SkyBackground imageUrl={sky} />
      <StarField />

      <div className="relative z-20 mx-auto max-w-3xl px-4 pt-10">
        <div className="flex items-start justify-between gap-4">

          {offlineDemo && (
            <span className="rounded-full bg-amber-300/20 px-3 py-1 text-xs text-amber-100 border border-amber-200/25">
              Offline demo
            </span>
          )}
        </div>
      </div>

      {/* bubbles */}
      <BubbleLayer messages={messages} />

      {/* input UI */}
      <ChatDock
        loading={loading}
        onSend={(sender, content) => send(sender, content)}
      />
    </div>
  );
}
