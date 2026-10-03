import { AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import { useEffect, useState } from 'react';
import Lobby from './components/Lobby';
import FleetSelection from './components/FleetSelection';
import Question from './components/Question';
import Leaderboard from './components/Leaderboard';
import LoadingScreen from './components/LoadingScreen';
import Podium from './components/Podium';
import Overlays from './components/Overlays';
import GgAvatarSetup from './components/GgAvatarSetup';
import SessionEnded from './components/SessionEnded';
import SessionExpiredModal from './components/SessionExpiredModal';

const GummyGumLockedScreen = () => (
  <div className="h-[100dvh] w-full bg-[#091521] text-white flex items-center justify-center px-6">
    <div className="max-w-sm w-full text-center space-y-4">
      <h1 className="text-xl font-bold">This experience is only available through GummyGum</h1>
      <p className="text-white/60 text-sm">Open it from the GummyGum hub to play.</p>
      <a
        href="https://gummygum.app"
        className="inline-block px-6 py-3 rounded-xl bg-amber-400 text-[#091521] font-bold text-sm"
      >
        Go to GummyGum
      </a>
    </div>
  </div>
);

const WaitingForHostScreen = () => (
  <div className="h-[100dvh] w-full bg-[#091521] text-white flex items-center justify-center px-6">
    <div className="max-w-sm w-full text-center space-y-4">
      <div className="w-10 h-10 mx-auto rounded-full border-4 border-white/20 border-t-amber-400 animate-spin" />
      <h1 className="text-xl font-bold">Waiting for the host</h1>
      <p className="text-white/60 text-sm">The game will open here as soon as the host starts this session.</p>
    </div>
  </div>
);

// Sabi only runs from a GummyGum launch, so there is no home, create or join screen to land on.
// Anything that would have shown one waits here while the room reconnects.
const ReconnectingScreen = () => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 8000);
    const t2 = setTimeout(() => setStage(2), 20000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return (
    <div className="h-[100dvh] w-full bg-[#091521] text-white flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-10 h-10 mx-auto rounded-full border-4 border-white/20 border-t-amber-400 animate-spin" />
        <h1 className="text-xl font-bold">{stage === 0 ? 'Loading…' : 'Still connecting… please wait'}</h1>
        {stage === 2 && (
          <p className="text-white/60 text-sm">
            This is taking longer than usual — check your internet connection. We'll keep trying.
          </p>
        )}
      </div>
    </div>
  );
};

function ScreenManager() {
  const { currentScreen, ggAccessState, ggSession, ggRouted, awaitingHost, isHost, isSessionExpired, sessionExpiredContext } = useGame();

  // Only blank the screen while that initial routing decision is still
  // in flight — once it's settled, going back to 'home' later (e.g. via
  // Podium's "Back to Home") should actually show Home, not this again.
  const routingIntoGgRoom = ggSession && ggSession.roomCode && currentScreen === 'home' && !ggRouted;

  if (awaitingHost && !ggRouted) {
    return <WaitingForHostScreen />;
  }

  if (ggAccessState === 'checking' || routingIntoGgRoom) {
    return <ReconnectingScreen />;
  }

  if (ggAccessState === 'denied') {
    return <GummyGumLockedScreen />;
  }

  if (['home', 'create', 'join'].includes(currentScreen)) {
    return <ReconnectingScreen />;
  }

  return (
    <div className="min-h-[100dvh] w-full relative bg-[#091521] overflow-x-hidden overflow-y-auto">
      <Overlays />
      <AnimatePresence mode="wait">
        {currentScreen === 'gg-avatar' && <GgAvatarSetup key="gg-avatar" />}
        {currentScreen === 'lobby' && <Lobby key="lobby" />}
        {currentScreen === 'fleet' && <FleetSelection key="fleet" />}
        {currentScreen === 'question' && <Question key="question" />}
        {currentScreen === 'leaderboard' && <Leaderboard key="leaderboard" />}
        {currentScreen === 'loading' && <LoadingScreen key="loading" />}
        {currentScreen === 'podium' && <Podium key="podium" />}
        {currentScreen === 'session-ended' && <SessionEnded key="session-ended" />}
      </AnimatePresence>
      {isSessionExpired && (
        <SessionExpiredModal
          isHost={Boolean(isHost || ggSession?.isHost)}
          context={sessionExpiredContext}
          hubUrl={ggSession?.hubUrl}
        />
      )}
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
