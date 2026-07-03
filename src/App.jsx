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

function ScreenManager() {
  const { currentScreen } = useGame();

  return (
    <div className="h-[100dvh] w-full relative bg-navy overflow-hidden">
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
