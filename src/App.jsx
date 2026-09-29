import { AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
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
    return <div className="h-[100dvh] w-full bg-navy" />;
  }

  if (ggAccessState === 'denied') {
    return <GummyGumLockedScreen />;
  }

  return (
    <div className="min-h-[100dvh] w-full relative bg-[#091521] overflow-x-hidden overflow-y-auto">
      <Overlays />
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && <Home key="home" />}
        {currentScreen === 'create' && <CreateGame key="create" />}
        {currentScreen === 'join' && <JoinGame key="join" />}
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
