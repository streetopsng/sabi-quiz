import { AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Lobby from './components/Lobby';
import FleetSelection from './components/FleetSelection';
import Question from './components/Question';
import Podium from './components/Podium';
import Overlays from './components/Overlays';

// This experience is only reachable through a GummyGum hub launch link.
// Direct/bookmarked visits (no `?ggt=` token and nothing stashed in
// sessionStorage from a prior launch) are blocked before any Home/game
// screen ever renders.
function GummyGumLockedScreen() {
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-navy px-6 text-center">
      <div className="max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-white">Not available here</h1>
        <p className="text-white/70">
          This experience is only available through GummyGum. Head back to the hub to launch it.
        </p>
        <a
          href="https://gummygum.app"
          className="inline-block w-full p-[18px] rounded-2xl bg-gradient-to-r from-amber to-[#e69b19] text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase shadow-[0_8px_30px_rgba(245,166,35,0.3)] transition-shadow hover:shadow-[0_8px_40px_rgba(245,166,35,0.4)]"
        >
          Go to GummyGum
        </a>
      </div>
    </div>
  );
}

function ScreenManager() {
  const { currentScreen, ggAccessState, ggSession } = useGame();

  const routingIntoGgRoom = ggSession && ggSession.roomCode && currentScreen === 'home';

  if (ggAccessState === 'checking' || routingIntoGgRoom) {
    return <div className="h-[100dvh] w-full bg-navy" />;
  }

  if (ggAccessState === 'denied') {
    return <GummyGumLockedScreen />;
  }

  return (
    <div className="h-[100dvh] w-full relative bg-[#0e1f29] overflow-hidden">
      <Overlays />
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && <Home key="home" />}
        {currentScreen === 'create' && <CreateGame key="create" />}
        {currentScreen === 'join' && <JoinGame key="join" />}
        {currentScreen === 'lobby' && <Lobby key="lobby" />}
        {currentScreen === 'fleet' && <FleetSelection key="fleet" />}
        {currentScreen === 'question' && <Question key="question" />}
        {currentScreen === 'podium' && <Podium key="podium" />}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <ScreenManager />
    </GameProvider>
  );
}

export default App;
