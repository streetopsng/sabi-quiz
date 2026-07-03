import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { INITIAL_PLAYER } from '../constants';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  // Generate or retrieve persistent Session ID
  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem('sabi_session_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('sabi_session_id', id);
    }
    return id;
  });

  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameCode, setGameCode] = useState('');
  const [gameConfig, setGameConfig] = useState(null);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [player, setPlayer] = useState({ ...INITIAL_PLAYER });
  const [opponents, setOpponents] = useState([]);
  
  // Gameplay state
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [bonusRound, setBonusRound] = useState(false);
  const [chosenAnswer, setChosenAnswer] = useState(-1);
  const [flashColor, setFlashColor] = useState(null); 
  const [streakToast, setStreakToast] = useState(null);
  
  // Option mapping for shuffling
  const optionMapRef = useRef([]);
  
  // Host state
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Auto-rejoin logic on mount/socket connection
  useEffect(() => {
    if (socket) {
      const savedCode = sessionStorage.getItem('sabi_game_code');
      if (savedCode) {
        socket.emit('rejoin_game', { code: savedCode, sessionId }, (res) => {
          if (res.success) {
            setGameCode(savedCode);
            setGameConfig(res.config);
            if (res.questions) setGameQuestions(res.questions);
            
            const isSavedHost = sessionStorage.getItem('sabi_is_host') === 'true';
            setIsHost(isSavedHost);
            
            if (res.state === 'question' && res.questionData) {
              setCurrentQ(res.currentQ);
              setTimeLeft(res.timeLeft);
              setBonusRound(res.bonusRound);
              setAnswered(false);
              setChosenAnswer(-1);
              
              let shuffledOpts = res.questionData.opts;
              let newOptionMap = res.questionData.opts.map((_, i) => i);
              if (res.questionData.type === 'mc') {
                const combined = res.questionData.opts.map((opt, i) => ({ opt, original: i }));
                combined.sort(() => Math.random() - 0.5);
                shuffledOpts = combined.map(c => c.opt);
                newOptionMap = combined.map(c => c.original);
              }
              optionMapRef.current = newOptionMap;

              setGameQuestions(prev => {
                const next = [...(res.questions || prev)];
                next[res.currentQ] = { ...res.questionData, opts: shuffledOpts };
                return next;
              });

              clearInterval(window.currentTimer);
              let ticks = res.timeLeft;
              window.currentTimer = setInterval(() => {
                ticks--;
                setTimeLeft(ticks);
                if (ticks <= 0) clearInterval(window.currentTimer);
              }, 1000);
            }
            
            updateScores(res.players);
            
            // Check if player had already answered
            const me = res.players.find(p => p.sessionId === sessionId);
            if (me && me.answered) {
              setAnswered(true);
            }

            navigate(res.state);
          } else {
            // Failed to rejoin (server restarted or game over)
            sessionStorage.removeItem('sabi_game_code');
            sessionStorage.removeItem('sabi_is_host');
          }
        });
      }
    }
  }, [socket, sessionId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('lobby_update', (playersList) => {
      updateScores(playersList);
    });

    socket.on('question_start', (data) => {
      setCurrentQ(data.qIndex);
      setBonusRound(data.bonusRound);
      setTimeLeft(data.timeLeft);
      setAnswered(false);
      setChosenAnswer(-1);
      
      let shuffledOpts = data.question.opts;
      let newOptionMap = data.question.opts.map((_, i) => i);
      
      if (data.question.type === 'mc') {
        const combined = data.question.opts.map((opt, i) => ({ opt, original: i }));
        combined.sort(() => Math.random() - 0.5);
        shuffledOpts = combined.map(c => c.opt);
        newOptionMap = combined.map(c => c.original);
      }
      
      optionMapRef.current = newOptionMap;

      setGameQuestions(prev => {
        const next = [...prev];
        next[data.qIndex] = { ...data.question, opts: shuffledOpts };
        return next;
      });

      updateScores(data.players);
      navigate('question');
      
      clearInterval(window.currentTimer);
      let ticks = data.timeLeft;
      window.currentTimer = setInterval(() => {
        ticks--;
        setTimeLeft(ticks);
        if (ticks <= 0) clearInterval(window.currentTimer);
      }, 1000);
    });

    socket.on('question_result', (data) => {
      clearInterval(window.currentTimer);
      setAnswered(true);
      
      const me = data.players.find(p => p.sessionId === sessionId);
      const wasCorrect = me && me.chosenAnswer === data.correctAnswer;
      
      if (me && chosenAnswer !== -1) {
        setFlashColor(wasCorrect ? 'green' : 'red');
        setTimeout(() => setFlashColor(null), 300);
      }

      if (wasCorrect && me) {
        showStreakToast(me.streak);
      }

      const renderedCorrectIndex = optionMapRef.current.indexOf(data.correctAnswer);
      
      setGameQuestions(prev => {
        const next = [...prev];
        if (next[currentQ]) {
          next[currentQ].answer = renderedCorrectIndex;
        }
        return next;
      });

      updateScores(data.players);
    });

    socket.on('game_over', (playersList) => {
      updateScores(playersList);
      sessionStorage.removeItem('sabi_game_code');
      sessionStorage.removeItem('sabi_is_host');
      navigate('podium');
    });

    socket.on('game_cancelled', () => {
      alert('The Race Director cancelled the session.');
      sessionStorage.removeItem('sabi_game_code');
      sessionStorage.removeItem('sabi_is_host');
      setGameCode('');
      navigate('home');
    });

    socket.on('kicked', () => {
      alert('You were removed from the lobby.');
      sessionStorage.removeItem('sabi_game_code');
      sessionStorage.removeItem('sabi_is_host');
      setGameCode('');
      navigate('home');
    });

    return () => {
      socket.off('lobby_update');
      socket.off('question_start');
      socket.off('question_result');
      socket.off('game_over');
      socket.off('game_cancelled');
      socket.off('kicked');
    };
  }, [socket, currentQ, sessionId, chosenAnswer]);

  const updateScores = (playersList) => {
    const me = playersList.find(p => p.sessionId === sessionId);
    if (me) setPlayer(prev => ({ ...prev, name: me.name, score: me.score, streak: me.streak, banter: me.banter || prev.banter, vehicle: me.vehicle || prev.vehicle, color: me.color || prev.color }));
    
    // Sort opponents by score and explicitly flag offline ones
    const others = playersList
      .filter(p => p.sessionId !== sessionId)
      .map(o => ({ ...o, _joined: o.connected !== false }));
      
    setOpponents(others);
  };

  const navigate = (screen) => {
    setCurrentScreen(screen);
  };

  const showStreakToast = (streak) => {
    let msg = '';
    if (streak >= 7) msg = '🏆 LEGENDARY!';
    else if (streak >= 5) msg = '💥 UNSTOPPABLE!';
    else if (streak >= 3) msg = '🔥 ON FIRE!';
    else if (streak >= 2) msg = '⚡ Double streak!';
    
    if (msg) {
      setStreakToast(msg);
      setTimeout(() => setStreakToast(null), 1800);
    }
  };

  const createGame = (config) => {
    setGameConfig(config);
    setIsHost(true);
    
    socket.emit('create_game', { ...config, sessionId }, (res) => {
      if (res.success) {
        setGameCode(res.code);
        setGameQuestions(res.questions);
        sessionStorage.setItem('sabi_game_code', res.code);
        sessionStorage.setItem('sabi_is_host', 'true');
        
        socket.emit('join_game', { code: res.code, player: { ...player, name: 'HR' }, sessionId }, (joinRes) => {
          navigate('lobby');
        });
      }
    });
  };

  const joinGameWithCode = (code, customName) => {
    const payloadPlayer = customName ? { ...player, name: customName } : player;
    
    socket.emit('join_game', { code, player: payloadPlayer, sessionId }, (res) => {
      if (res.success) {
        setGameCode(code);
        setGameQuestions(res.questions || []);
        setGameConfig(res.config);
        setIsHost(false);
        sessionStorage.setItem('sabi_game_code', code);
        sessionStorage.setItem('sabi_is_host', 'false');
        navigate('lobby');
      } else {
        alert(res.message);
      }
    });
  };

  useEffect(() => {
    if (socket && gameCode) {
      socket.emit('update_player', { code: gameCode, player, sessionId });
    }
  }, [player.vehicle, player.color, player.banter]);

  const startRace = () => {
    if (isHost) {
      socket.emit('start_game', { code: gameCode, sessionId });
    }
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setAnswered(true);
    setChosenAnswer(idx);
    
    socket.emit('submit_answer', { code: gameCode, sessionId, answerIndex: optionMapRef.current[idx] });
  };

  const cancelGame = () => {
    if (isHost) {
      socket.emit('cancel_game', { code: gameCode, sessionId });
      sessionStorage.removeItem('sabi_game_code');
      sessionStorage.removeItem('sabi_is_host');
      setGameCode('');
      navigate('home');
    }
  };

  const kickPlayer = (targetSessionId) => {
    if (isHost) {
      socket.emit('kick_player', { code: gameCode, sessionId, targetSessionId });
    }
  };

  return (
    <GameContext.Provider value={{
      currentScreen, navigate,
      player, setPlayer,
      opponents,
      gameCode, createGame, joinGameWithCode, gameConfig, gameQuestions,
      currentQ, timeLeft, answered, bonusRound, chosenAnswer,
      flashColor, streakToast,
      startRace, handleAnswer, isHost, cancelGame, kickPlayer
    }}>
      {children}
    </GameContext.Provider>
  );
};
