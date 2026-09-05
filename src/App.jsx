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

function ScreenManager() {
  const { currentScreen, ggAccessState, ggSession, ggRouted } = useGame();

  // Only blank the screen while that initial routing decision is still
  // in flight — once it's settled, going back to 'home' later (e.g. via
  // Podium's "Back to Home") should actually show Home, not this again.
  const routingIntoGgRoom = ggSession && ggSession.roomCode && currentScreen === 'home' && !ggRouted;

  if (ggAccessState === 'checking' || routingIntoGgRoom) {
    return <div className="h-[100dvh] w-full bg-navy" />;
  }

  // Home is visible either way — createGame/joinGameWithCode are the ones
  // that actually gate on ggAccessState === 'denied', so a direct visitor
  // only hits the "only available through GummyGum" message once they try
  // to create or join, not before they've even seen the app.
  return (
    <div className="min-h-[100dvh] w-full relative bg-[#091521] overflow-x-hidden overflow-y-auto">
      <Overlays />
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && <Home key="home" />}
        {currentScreen === 'create' && <CreateGame key="create" />}
        {currentScreen === 'join' && <JoinGame key="join" />}
        {currentScreen === 'lobby' && <Lobby key="lobby" />}
        {currentScreen === 'fleet' && <FleetSelection key="fleet" />}
        {currentScreen === 'question' && <Question key="question" />}
        {currentScreen === 'leaderboard' && <Leaderboard key="leaderboard" />}
        {currentScreen === 'loading' && <LoadingScreen key="loading" />}
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
