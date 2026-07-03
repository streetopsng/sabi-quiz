import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, collection, setDoc, getDoc, updateDoc, onSnapshot, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { INITIAL_PLAYER, QUESTIONS } from '../constants';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
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
  
  const optionMapRef = useRef([]);
  const shuffledQRef = useRef(-1);
  const gameRef = useRef(null);
  const resolvingRef = useRef(false);
  
  const [isHost, setIsHost] = useState(false);

  // Auto-rejoin logic
  useEffect(() => {
    const savedCode = sessionStorage.getItem('sabi_game_code');
    if (savedCode) {
      joinGameWithCode(savedCode);
    }
  }, []);

  // Firebase Realtime Listeners
  useEffect(() => {
    if (!gameCode) return;

    // Listen to Game Document
    const unsubGame = onSnapshot(doc(db, 'games', gameCode), (snapshot) => {
      if (!snapshot.exists()) {
        alert('The Race Director cancelled the session.');
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_is_host');
        setGameCode('');
        navigate('home');
        return;
      }

      const data = snapshot.data();
      gameRef.current = data;
      
      setCurrentQ(data.currentQ);
      setBonusRound(data.bonusRound);
      
      // Handle screen routing based on game state
      if (data.state === 'question') {
        if (currentScreen !== 'question') navigate('question');
        
        // Setup local timer based on server timestamp
        if (data.startedAt) {
          const elapsed = Math.floor((Date.now() - data.startedAt) / 1000);
          const tLeft = Math.max(0, data.config.timerMode - elapsed);
          setTimeLeft(tLeft);
          
          clearInterval(window.currentTimer);
          if (tLeft > 0) {
            window.currentTimer = setInterval(() => {
              setTimeLeft(prev => {
                if (prev <= 1) {
                  clearInterval(window.currentTimer);
                  if (isHost) resolveQuestion(gameCode);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else if (isHost) {
            resolveQuestion(gameCode);
          }
        }

        // Shuffle options once per new question
        if (shuffledQRef.current !== data.currentQ) {
          shuffledQRef.current = data.currentQ;
          setAnswered(false);
          setChosenAnswer(-1);
          
          let shuffledOpts = data.questions[data.currentQ].opts;
          let newOptionMap = data.questions[data.currentQ].opts.map((_, i) => i);
          
          if (data.questions[data.currentQ].type === 'mc') {
            const combined = data.questions[data.currentQ].opts.map((opt, i) => ({ opt, original: i }));
            combined.sort(() => Math.random() - 0.5);
            shuffledOpts = combined.map(c => c.opt);
            newOptionMap = combined.map(c => c.original);
          }
          
          optionMapRef.current = newOptionMap;
          setGameQuestions(prev => {
            const next = [...prev];
            next[data.currentQ] = { ...data.questions[data.currentQ], opts: shuffledOpts };
            return next;
          });
        }
      } else if (data.state === 'result') {
        clearInterval(window.currentTimer);
        
        // Show correct answer
        const renderedCorrectIndex = optionMapRef.current.indexOf(data.questions[data.currentQ].answer);
        setGameQuestions(prev => {
          const next = [...prev];
          if (next[data.currentQ]) next[data.currentQ].answer = renderedCorrectIndex;
          return next;
        });
      } else if (data.state === 'podium' && currentScreen !== 'podium') {
        navigate('podium');
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_is_host');
      }
    });

    // Listen to Players Collection
    const unsubPlayers = onSnapshot(collection(db, 'games', gameCode, 'players'), (snapshot) => {
      const playersList = snapshot.docs.map(d => d.data());
      
      const me = playersList.find(p => p.sessionId === sessionId);
      if (me) {
        setPlayer(prev => ({ ...prev, name: me.name, score: me.score, streak: me.streak, banter: me.banter || prev.banter, vehicle: me.vehicle || prev.vehicle, color: me.color || prev.color }));
        
        // Handle result flashing
        if (gameRef.current && gameRef.current.state === 'result' && chosenAnswer !== -1) {
           const wasCorrect = me.chosenAnswer === gameRef.current.questions[gameRef.current.currentQ].answer;
           setFlashColor(wasCorrect ? 'green' : 'red');
           setTimeout(() => setFlashColor(null), 300);
           if (wasCorrect) showStreakToast(me.streak);
        }
      }
      
      const others = playersList
        .filter(p => p.sessionId !== sessionId)
        .map(o => ({ ...o, _joined: o.connected !== false }));
      setOpponents(others);

      // Smart Timer Skip: Host checks if everyone answered
      if (isHost && gameRef.current && gameRef.current.state === 'question') {
        const activePlayers = playersList.filter(p => p.connected !== false);
        const allAnswered = activePlayers.length > 0 && activePlayers.every(p => p.answered);
        if (allAnswered) {
          resolveQuestion(gameCode);
        }
      }
    });

    return () => {
      unsubGame();
      unsubPlayers();
      clearInterval(window.currentTimer);
    };
  }, [gameCode, isHost, currentScreen, chosenAnswer]);

  const navigate = (screen) => setCurrentScreen(screen);

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

  const createGame = async (config) => {
    try {
      setGameConfig(config);
      setIsHost(true);
      
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for(let i=0; i<6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      
      let generatedQuestions = [];
      while (generatedQuestions.length < config.qCount) {
        generatedQuestions = [...generatedQuestions, ...QUESTIONS];
      }
      generatedQuestions = generatedQuestions.slice(0, config.qCount);

      // Optimistic UI updates
      setGameCode(code);
      setGameQuestions(generatedQuestions);
      sessionStorage.setItem('sabi_game_code', code);
      sessionStorage.setItem('sabi_is_host', 'true');
      navigate('lobby');

      // Background Network writes via Batch for max speed
      const batch = writeBatch(db);
      
      batch.set(doc(db, 'games', code), {
        code,
        hostSessionId: sessionId,
        config,
        questions: generatedQuestions,
        state: 'lobby',
        currentQ: 0,
        startedAt: null
      });

      batch.set(doc(db, 'games', code, 'players', sessionId), {
        ...player,
        name: 'HR Admin',
        sessionId,
        score: 0,
        streak: 0,
        answered: false,
        chosenAnswer: -1,
        connected: true
      });

      await batch.commit();
      
    } catch (err) {
      console.error("Firebase Create Game Error:", err);
      alert("Failed to create game: " + err.message + "\n\nCheck your Firebase Rules and Environment Variables!");
      navigate('home');
    }
  };

  const joinGameWithCode = async (code, customName) => {
    try {
      const gameDoc = await getDoc(doc(db, 'games', code));
      if (!gameDoc.exists()) {
        alert("Game not found or invalid code!");
        return;
      }
      
      const gameData = gameDoc.data();
      setGameCode(code);
      setGameConfig(gameData.config);
      setGameQuestions(gameData.questions);
      
      const isSavedHost = sessionStorage.getItem('sabi_is_host') === 'true' && gameData.hostSessionId === sessionId;
      setIsHost(isSavedHost);
      sessionStorage.setItem('sabi_game_code', code);
      if (!isSavedHost) sessionStorage.setItem('sabi_is_host', 'false');
      
      // Fire and forget player write for instant UI transition
      const playerRef = doc(db, 'games', code, 'players', sessionId);
      getDoc(playerRef).then(pDoc => {
        if (!pDoc.exists()) {
          setDoc(playerRef, {
            ...player,
            name: customName || player.name,
            sessionId,
            score: 0,
            streak: 0,
            answered: false,
            chosenAnswer: -1,
            connected: true
          });
        } else {
          updateDoc(playerRef, {
            connected: true,
            ...(customName && { name: customName })
          });
        }
      });
      
      navigate(gameData.state);
    } catch(err) {
      alert("Failed to join: " + err.message);
    }
  };

  // Sync player cosmetics
  useEffect(() => {
    if (gameCode) {
      updateDoc(doc(db, 'games', gameCode, 'players', sessionId), {
        vehicle: player.vehicle,
        color: player.color,
        banter: player.banter
      }).catch(e => console.log('Player update skipped', e));
    }
  }, [player.vehicle, player.color, player.banter]);

  const startRace = async () => {
    if (!isHost) return;
    
    // Reset all players
    const playersSnap = await getDocs(collection(db, 'games', gameCode, 'players'));
    const batchPromises = playersSnap.docs.map(d => 
      updateDoc(d.ref, { answered: false, chosenAnswer: -1 })
    );
    await Promise.all(batchPromises);

    await updateDoc(doc(db, 'games', gameCode), {
      state: 'question',
      currentQ: 0,
      startedAt: Date.now(),
      bonusRound: Math.random() < 0.25,
      firstBloodQ: false
    });
  };

  const handleAnswer = async (idx) => {
    if (answered) return;
    setAnswered(true);
    setChosenAnswer(idx);
    
    await updateDoc(doc(db, 'games', gameCode, 'players', sessionId), {
      answered: true,
      chosenAnswer: optionMapRef.current[idx],
      answeredAt: Date.now()
    });
  };

  const resolveQuestion = async (code) => {
    if (resolvingRef.current) return;
    resolvingRef.current = true;
    clearInterval(window.currentTimer);
    
    await updateDoc(doc(db, 'games', code), { state: 'result' });
    
    const gameSnap = await getDoc(doc(db, 'games', code));
    const game = gameSnap.data();
    const correctIndex = game.questions[game.currentQ].answer;
    
    const pSnap = await getDocs(collection(db, 'games', code, 'players'));
    let firstBloodUsed = false;
    
    const updatePromises = pSnap.docs.map(async (d) => {
       const p = d.data();
       if (p.answered && p.chosenAnswer === correctIndex) {
          let pts = 100;
          const timeTaken = p.answeredAt ? (p.answeredAt - game.startedAt) / 1000 : 15;
          const tLeft = Math.max(0, game.config.timerMode - timeTaken);
          
          if (tLeft >= 11) pts += 50;
          else if (tLeft >= 6) pts += 25;
          
          if (!firstBloodUsed) { pts += 20; firstBloodUsed = true; }
          if (game.bonusRound) pts *= 2;
          
          let streakMult = p.streak >= 7 ? 2.5 : p.streak >= 5 ? 2.0 : p.streak >= 3 ? 1.5 : p.streak >= 2 ? 1.2 : 1.0;
          pts = Math.round(pts * streakMult);
          
          return updateDoc(d.ref, { score: p.score + pts, streak: p.streak + 1 });
       } else {
          return updateDoc(d.ref, { streak: 0 });
       }
    });
    
    await Promise.all(updatePromises);

    setTimeout(async () => {
       resolvingRef.current = false;
       if (game.currentQ + 1 >= game.questions.length) {
          await updateDoc(doc(db, 'games', code), { state: 'podium' });
       } else {
          const snap2 = await getDocs(collection(db, 'games', code, 'players'));
          const rPromises = snap2.docs.map(d => updateDoc(d.ref, { answered: false, chosenAnswer: -1 }));
          await Promise.all(rPromises);
          
          await updateDoc(doc(db, 'games', code), {
             state: 'question',
             currentQ: game.currentQ + 1,
             startedAt: Date.now(),
             bonusRound: Math.random() < 0.25,
             firstBloodQ: false
          });
       }
    }, 3000);
  };

  const cancelGame = async () => {
    if (isHost) {
      await deleteDoc(doc(db, 'games', gameCode));
      sessionStorage.removeItem('sabi_game_code');
      sessionStorage.removeItem('sabi_is_host');
      setGameCode('');
      navigate('home');
    }
  };

  const kickPlayer = async (targetSessionId) => {
    if (isHost) {
      await deleteDoc(doc(db, 'games', gameCode, 'players', targetSessionId));
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
