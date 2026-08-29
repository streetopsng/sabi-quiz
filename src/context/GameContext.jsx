import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, collection, setDoc, getDoc, updateDoc, onSnapshot, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { INITIAL_PLAYER, QUESTIONS } from '../constants';
import { playJoin, playStart, playTick, playCorrect, playWrong, playWin, playSelect } from '../utils/audio';
import { resolveGummyGumLaunch, reportGummyGumResult, reportGummyGumCancel } from '../lib/gummygumSession';

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
  const [gameState, setGameState] = useState('lobby');
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
  const [isSpectator, setIsSpectator] = useState(() => sessionStorage.getItem('sabi_is_spectator') === 'true');

  // GummyGum hub identity handoff (who launched this session, if anyone).
  // This experience is only playable when arriving via a hub launch link, so
  // we also track access separately from the session payload itself:
  // 'checking' while the resolve promise is in flight, 'granted' once we
  // have a real session, 'denied' once resolution comes back empty (no
  // token, nothing stored — i.e. direct/bookmarked access).
  const [ggSession, setGgSession] = useState(null);
  const [ggAccessState, setGgAccessState] = useState('checking');
  // Only true for the brief window while the initial GummyGum routing
  // decision is being made — the blank loading screen it gates should
  // never come back once that's settled, or "Back to Home" after a game
  // ends re-triggers it every time currentScreen cycles back to 'home'
  // (looks exactly like the page silently refreshing).
  const [ggRouted, setGgRouted] = useState(false);
  const ggReportedRef = useRef(false);

  // Custom Alert Modal State
  const [alertModal, setAlertModal] = useState(null);

  const showAlertModal = (message, title = 'Notice', onConfirm = null) => {
    setAlertModal({ message, title, onConfirm });
  };

  const closeAlertModal = () => {
    setAlertModal(null);
  };

  useEffect(() => {
    resolveGummyGumLaunch().then((session) => {
      setGgSession(session);
      setGgAccessState(session ? 'granted' : 'denied');
    });
  }, []);

  // Auto-rejoin logic
  useEffect(() => {
    const savedCode = sessionStorage.getItem('sabi_game_code');
    if (savedCode) {
      joinGameWithCode(savedCode);
    }
  }, []);

  // Routing back through Create would overwrite an already-created game doc.
  useEffect(() => {
    if (!ggSession || !ggSession.roomCode) return;
    if (!ggSession.isHost) {
      joinGameWithCode(ggSession.roomCode, ggSession.player?.name);
      setGgRouted(true);
      return;
    }
    getDoc(doc(db, 'games', ggSession.roomCode)).then((existing) => {
      if (existing.exists()) {
        claimHostedRoom(ggSession.roomCode, ggSession.player?.name);
      } else {
        navigate('create');
      }
      setGgRouted(true);
    });
  }, [ggSession]);

  // Report the result back to GummyGum once the race ends. The host is
  // usually running this for their whole team, so this reports the full
  // roster (host + everyone who joined with the PIN), not just the host's
  // own score, plus the host's own placement for convenience.
  useEffect(() => {
    // isHost matters here: every GummyGum-launched participant reaches
    // podium too, and without this guard each of their browsers would
    // independently report the *same* full roster — self-labeled as host
    // in their own copy — multiplying every score and session count by
    // however many people launched through their own link.
    if (gameState !== 'podium' || ggReportedRef.current || !ggSession || !isHost) return;
    ggReportedRef.current = true;
    const roster = [{ name: player.name, score: player.score, streak: player.streak, isHost: true }, ...opponents.map((o) => ({
      name: o.name,
      score: o.score,
      streak: o.streak,
      isHost: false,
    }))].sort((a, b) => b.score - a.score);
    reportGummyGumResult({
      gameCode,
      hostName: player.name,
      hostScore: player.score,
      hostStreak: player.streak,
      participantCount: roster.length,
      leaderboard: roster,
    });
  }, [gameState, ggSession, isHost, player.score, player.streak, player.name, opponents, gameCode]);

  // Firebase Realtime Listeners
  useEffect(() => {
    if (!gameCode) return;

    // Listen to Game Document
    const unsubGame = onSnapshot(doc(db, 'games', gameCode), (snapshot) => {
      if (!snapshot.exists()) {
        showAlertModal('The Race Director cancelled the session.', 'Session Cancelled');
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_is_host');
        setGameCode('');
        navigate('home');
        return;
      }

      const data = snapshot.data();
      gameRef.current = data;
      
      setGameState(data.state);
      setCurrentQ(data.currentQ);
      setBonusRound(data.bonusRound);
      
      // Handle screen routing based on game state
      if (data.state === 'question') {
        if (currentScreen !== 'question') {
          playStart();
          navigate('question');
        }
        
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
                if (prev <= 6) playTick();
                return prev - 1;
              });
            }, 1000);
          } else if (isHost) {
            resolveQuestion(gameCode);
          }
        }

        // Shuffle options independently for each player's device
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
          const clientAnswerIndex = newOptionMap.indexOf(data.questions[data.currentQ].answer);

          setGameQuestions(prev => {
            const next = [...prev];
            next[data.currentQ] = { 
              ...data.questions[data.currentQ], 
              opts: shuffledOpts,
              answer: clientAnswerIndex 
            };
            return next;
          });
        }
      } else if (data.state === 'result') {
        clearInterval(window.currentTimer);
        setAnswered(true); // Ensure players who didn't click still see the result
      } else if (data.state === 'podium' && currentScreen !== 'podium') {
        playWin();
        navigate('podium');
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_is_host');
        sessionStorage.removeItem('sabi_is_spectator');
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
           if (wasCorrect) playCorrect(); else playWrong();
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

  const createGame = (config) => {
    // 1. Instant optimistic state update to allow browser main thread to paint immediately (<5ms INP)
    setGameConfig(config);
    setIsHost(true);
    if (config.playAsContestant) {
      setIsSpectator(false);
      sessionStorage.setItem('sabi_is_spectator', 'false');
      setPlayer(p => ({ ...p, name: config.hostName || 'HR Admin' }));
    } else {
      setIsSpectator(true);
      sessionStorage.setItem('sabi_is_spectator', 'true');
    }
    navigate('lobby');

    // 2. Defer question array processing and network batch creation to next event loop frame
    setTimeout(async () => {
      try {
        let code = ggSession && ggSession.isHost && ggSession.roomCode ? ggSession.roomCode : '';
        if (!code) {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          for(let i=0; i<6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        let pool = [...QUESTIONS].sort(() => Math.random() - 0.5);
        let generatedQuestions = [];
        while (generatedQuestions.length < config.qCount) {
          generatedQuestions = [...generatedQuestions, ...pool];
        }
        generatedQuestions = generatedQuestions.slice(0, config.qCount);

        setGameCode(code);
        setGameQuestions(generatedQuestions);
        sessionStorage.setItem('sabi_game_code', code);
        sessionStorage.setItem('sabi_is_host', 'true');

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

        if (config.playAsContestant) {
          batch.set(doc(db, 'games', code, 'players', sessionId), {
            ...player,
            name: config.hostName || 'HR Admin',
            sessionId,
            score: 0,
            streak: 0,
            answered: false,
            chosenAnswer: -1,
            connected: true
          });
        }

        await batch.commit();
      } catch (err) {
        console.error("Firebase Create Game Error:", err);
        showAlertModal("Failed to create game: " + err.message, "Create Game Error");
        navigate('home');
      }
    }, 0);
  };

  // GummyGum pre-creates the room doc but can't know this browser's Sabi
  // sessionId in advance (it's only generated once this page actually
  // loads), so it leaves hostSessionId null and writes no player doc.
  // Claiming here mirrors what createGame() does for a host creating
  // their own room, just against a doc that already exists — and
  // deliberately doesn't reuse joinGameWithCode's "name already taken"
  // guard, which is meant to stop two different people picking the same
  // nickname, not to block the host from entering their own room.
  const claimHostedRoom = (code, hostName) => {
    setTimeout(async () => {
      try {
        const gameDoc = await getDoc(doc(db, 'games', code));
        if (!gameDoc.exists()) {
          navigate('create');
          return;
        }
        const gameData = gameDoc.data();
        const name = hostName || player.name || 'HR Admin';

        setGameCode(code);
        setGameConfig(gameData.config);
        setGameQuestions(gameData.questions);
        setIsHost(true);
        sessionStorage.setItem('sabi_game_code', code);
        sessionStorage.setItem('sabi_is_host', 'true');

        await updateDoc(doc(db, 'games', code), { hostSessionId: sessionId });

        if (gameData.config?.playAsContestant) {
          setIsSpectator(false);
          sessionStorage.setItem('sabi_is_spectator', 'false');
          setPlayer((p) => ({ ...p, name }));
          await setDoc(doc(db, 'games', code, 'players', sessionId), {
            ...player,
            name,
            sessionId,
            score: 0,
            streak: 0,
            answered: false,
            chosenAnswer: -1,
            connected: true,
          });
        } else {
          setIsSpectator(true);
          sessionStorage.setItem('sabi_is_spectator', 'true');
        }

        navigate(gameData.state);
      } catch (err) {
        showAlertModal('Failed to join: ' + err.message, 'Join Error');
      }
    }, 0);
  };

  const joinGameWithCode = (code, customName) => {
    // Non-blocking async scheduler ensures click event completes in <3ms for zero INP latency
    setTimeout(async () => {
      try {
        const gameDoc = await getDoc(doc(db, 'games', code));
        if (!gameDoc.exists()) {
          showAlertModal("Game not found or invalid code!", "Invalid Game PIN");
          return;
        }
        
        const gameData = gameDoc.data();
        const requestedName = customName || player.name;
        
        // Prevent duplicate names
        const pSnap = await getDocs(collection(db, 'games', code, 'players'));
        const nameExists = pSnap.docs.some(d => {
           const p = d.data();
           return p.name.toLowerCase() === requestedName.toLowerCase() && p.sessionId !== sessionId;
        });
        
        if (nameExists) {
           showAlertModal("That nickname is already taken! Please choose another.", "Nickname Taken");
           return;
        }
        
        setGameCode(code);
        setGameConfig(gameData.config);
        setGameQuestions(gameData.questions);
        
        const isSavedHost = sessionStorage.getItem('sabi_is_host') === 'true' && gameData.hostSessionId === sessionId;
        setIsHost(isSavedHost);
        sessionStorage.setItem('sabi_game_code', code);
        if (!isSavedHost) sessionStorage.setItem('sabi_is_host', 'false');
        
        setIsSpectator(false);
        sessionStorage.setItem('sabi_is_spectator', 'false');
        
        const playerRef = doc(db, 'games', code, 'players', sessionId);
        const pDoc = await getDoc(playerRef);
        if (!pDoc.exists()) {
          await setDoc(playerRef, {
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
          await updateDoc(playerRef, {
            connected: true,
            ...(customName && { name: customName })
          });
        }
        
        navigate(gameData.state);
      } catch(err) {
        showAlertModal("Failed to join: " + err.message, "Join Error");
      }
    }, 0);
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

  const startRace = () => {
    if (!isHost) return;
    setTimeout(async () => {
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
    }, 0);
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setAnswered(true);
    setChosenAnswer(idx);
    
    setTimeout(async () => {
      await updateDoc(doc(db, 'games', gameCode, 'players', sessionId), {
        answered: true,
        chosenAnswer: optionMapRef.current[idx],
        answeredAt: Date.now()
      });
    }, 0);
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
    }, 1500);
  };

  const cancelGame = async () => {
    if (isHost) {
      await deleteDoc(doc(db, 'games', gameCode));
      sessionStorage.removeItem('sabi_game_code');
      sessionStorage.removeItem('sabi_is_host');
      setGameCode('');
      // Only relevant for a room launched through GummyGum — a no-op
      // (early return) for a plain direct-visit game with nothing stored.
      reportGummyGumCancel();
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
      gameState, currentQ, timeLeft, answered, bonusRound, chosenAnswer,
      flashColor, streakToast,
      startRace, handleAnswer, isHost, cancelGame, kickPlayer, isSpectator,
      ggSession, ggAccessState, ggRouted,
      alertModal, showAlertModal, closeAlertModal
    }}>
      {children}
    </GameContext.Provider>
  );
};
