import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, collection, setDoc, getDoc, updateDoc, onSnapshot, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { INITIAL_PLAYER, QUESTIONS } from '../constants';
import { playJoin, playStart, playTick, playCorrect, playWrong, playWin, playSelect } from '../utils/audio';
import { resolveGummyGumLaunch, reportGummyGumResult, reportGummyGumCancel, returnToGummyGum } from '../lib/gummygumSession';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem('sabi_session_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('sabi_session_id', id);
    }
    return id;
  });

  const [currentScreen, setCurrentScreen] = useState('home');
  const currentScreenRef = useRef(currentScreen);
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  const [leaderboardStartedAt, setLeaderboardStartedAt] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [gameConfig, setGameConfig] = useState(null);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [player, setPlayer] = useState({ ...INITIAL_PLAYER });
  const [opponents, setOpponents] = useState([]);

  const [gameState, setGameState] = useState('lobby');
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [bonusRound, setBonusRound] = useState(false);
  const [chosenAnswer, setChosenAnswer] = useState(-1);
  const [flashColor, setFlashColor] = useState(null); 
  const [streakToast, setStreakToast] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const optionMapRef = useRef([]);
  const shuffledQRef = useRef(-1);
  const gameRef = useRef(null);
  const resolvingRef = useRef(false);
  
  const [isHost, setIsHost] = useState(false);
  const [isSpectator, setIsSpectator] = useState(() => sessionStorage.getItem('sabi_is_spectator') === 'true');
  const [hostSettings, setHostSettings] = useState({
    teamMode: false,
    presenterMode: true,
    showQuestionsOnDevices: true,
    privateScoring: false,
    difficulty: 'Mixed'
  });

  const [invitedCount, setInvitedCount] = useState(() => {
    const p = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const ic = p?.get('invitedCount');
    return ic ? parseInt(ic, 10) : null;
  });

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

  const [alertModal, setAlertModal] = useState(null);

  const showAlertModal = (message, title = 'Notice', onConfirm = null, cta = null) => {
    setAlertModal({ message, title, onConfirm, cta });
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

  // Routing back through Create would overwrite an already-created game doc.
  // When a participant refreshes, don't force them back to avatar setup if they already joined this room.
  useEffect(() => {
    // If still resolving GummyGum launch, wait until resolved to avoid checking stale sessions prematurely
    if (ggAccessState === 'checking') return;

    if (!ggSession || !ggSession.roomCode) {
      const savedCode = sessionStorage.getItem('sabi_game_code');
      if (savedCode) {
        // Silently verify if saved game room still exists before attempting to join
        getDoc(doc(db, 'games', savedCode)).then((existing) => {
          if (existing.exists()) {
            joinGameWithCode(savedCode);
          } else {
            sessionStorage.removeItem('sabi_game_code');
            sessionStorage.removeItem('sabi_joined_room');
            sessionStorage.removeItem('sabi_is_host');
            sessionStorage.removeItem('sabi_is_spectator');
          }
        }).catch(() => {
          sessionStorage.removeItem('sabi_game_code');
        });
      }
      return;
    }
    if (!ggSession.isHost) {
      const email = (ggSession.player?.email || '').toLowerCase().trim();
      const roomCode = ggSession.roomCode;
      const savedCode = sessionStorage.getItem('sabi_game_code');
      const savedJoined = sessionStorage.getItem('sabi_joined_room');
      const localJoined = email ? localStorage.getItem(`sabi_joined_${roomCode}_${email}`) === 'true' : false;

      // 1. Fast local check (sessionStorage or localStorage for this room)
      if (savedCode === roomCode || savedJoined === roomCode || localJoined) {
        const savedAvatar = (email && localStorage.getItem(`sabi_avatar_${email}`)) || player.vehicle;
        const savedName = (email && localStorage.getItem(`sabi_name_${email}`)) || ggSession.player?.name || player.name;
        if (savedAvatar) setPlayer((p) => ({ ...p, vehicle: savedAvatar, name: savedName }));
        setGgRouted(true);
        joinGameWithCode(roomCode, savedName, () => setGgRouted(true), email);
        return;
      }

      // 2. Query Firestore to check if this participant already joined this room (e.g. fresh tab via email link)
      getDocs(collection(db, 'games', roomCode, 'players')).then((pSnap) => {
        const existingPlayer = pSnap.docs.find((d) => {
          const data = d.data();
          const docEmail = (data.ggEmail || '').toLowerCase().trim();
          const docName = (data.name || '').toLowerCase().trim();
          return (email && docEmail === email) || (ggSession.player?.name && docName === ggSession.player.name.toLowerCase().trim());
        });

        if (existingPlayer) {
          const priorData = existingPlayer.data();
          const restoredAvatar = priorData.vehicle || (email && localStorage.getItem(`sabi_avatar_${email}`)) || player.vehicle;
          const restoredName = priorData.name || (email && localStorage.getItem(`sabi_name_${email}`)) || ggSession.player?.name || player.name;

          if (email) {
            localStorage.setItem(`sabi_joined_${roomCode}_${email}`, 'true');
            localStorage.setItem(`sabi_avatar_${email}`, restoredAvatar);
            localStorage.setItem(`sabi_name_${email}`, restoredName);
          }
          sessionStorage.setItem('sabi_game_code', roomCode);
          sessionStorage.setItem('sabi_joined_room', roomCode);

          setPlayer((p) => ({ ...p, vehicle: restoredAvatar, name: restoredName }));
          setGgRouted(true);
          joinGameWithCode(roomCode, restoredName, () => setGgRouted(true), email);
        } else {
          // Genuinely first time: pre-fill remembered avatar/name from past sessions if available
          const rememberedAvatar = email ? localStorage.getItem(`sabi_avatar_${email}`) : null;
          const initialName = (email && localStorage.getItem(`sabi_name_${email}`)) || ggSession.player?.name || player.name || '';
          setPlayer((p) => ({
            ...p,
            name: initialName,
            ...(rememberedAvatar && { vehicle: rememberedAvatar }),
          }));
          navigate('gg-avatar');
          setGgRouted(true);
        }
      }).catch(() => {
        setPlayer((p) => ({ ...p, name: ggSession.player?.name || p.name || '' }));
        navigate('gg-avatar');
        setGgRouted(true);
      });
      return;
    }
    getDoc(doc(db, 'games', ggSession.roomCode)).then((existing) => {
      if (existing.exists()) {
        claimHostedRoom(ggSession.roomCode, ggSession.player?.name, () => setGgRouted(true));
      } else {
        navigate('create');
        setGgRouted(true);
      }
    });
  }, [ggSession, ggAccessState]);

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
    const roster = opponents.map((o) => ({
      name: o.name,
      score: o.score,
      streak: o.streak,
      isHost: false,
    })).sort((a, b) => b.score - a.score);
    reportGummyGumResult({
      gameCode,
      hostName: player.name,
      participantCount: roster.length,
      leaderboard: roster,
    });
  }, [gameState, ggSession, isHost, player.name, opponents, gameCode]);

  useEffect(() => {
    if (!gameCode) return;

    const unsubGame = onSnapshot(doc(db, 'games', gameCode), (snapshot) => {
      if (!snapshot.exists()) {
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_is_host');
        setGameCode('');

        if (ggSession?.isHost) {
          // GummyGum is the source of this cancellation (or already knows
          // about it) — just send the host back to the hub, no need to
          // re-hit the close endpoint via closeGummyGumSession().
          returnToGummyGum();
        } else if (ggSession) {
          // Participant: mirror the leaderboard/podium close-tab pattern
          // instead of routing to the native landing screen.
          window.close();
          setTimeout(() => {
            showAlertModal('This session was cancelled by the host. You can close this tab now.', 'Session Cancelled');
          }, 400);
        } else {
          showAlertModal('The Race Director cancelled the session.', 'Session Cancelled');
          navigate('home');
        }
        return;
      }

      const data = snapshot.data();
      gameRef.current = data;
      if (data.invitedCount) setInvitedCount(data.invitedCount);
      else if (data.config?.invitedCount) setInvitedCount(data.config.invitedCount);
      if (data.leaderboardStartedAt) setLeaderboardStartedAt(data.leaderboardStartedAt);
      
      setGameState(data.state);
      setCurrentQ(data.currentQ);
      setBonusRound(data.bonusRound);
      setLoadingMessage(data.loadingMessage || '');
      
      if (data.state === 'question') {
        if (currentScreenRef.current !== 'question') {
          playStart();
          navigate('question');
        }
        
        // Setup local timer based on server timestamp with grace buffer
        if (data.startedAt) {
          const timerDuration = data.config?.timerMode || 15;
          const totalMs = timerDuration * 1000;
          const hostBufferMs = 1500; // 1.5s grace buffer so participant countdown reaches 0 before result reveals

          const computeRemaining = () => {
            const now = Date.now();
            const elapsed = now - data.startedAt;
            const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
            return { remaining, elapsed };
          };

          const initial = computeRemaining();
          setTimeLeft(initial.remaining);

          clearInterval(window.currentTimer);

          if (isHost && initial.elapsed >= totalMs + hostBufferMs) {
            resolveQuestion(gameCode);
          } else {
            window.currentTimer = setInterval(() => {
              const { remaining, elapsed } = computeRemaining();
              setTimeLeft(remaining);

              if (remaining <= 6 && remaining > 0) {
                playTick();
              }

              if (isHost && elapsed >= totalMs + hostBufferMs) {
                clearInterval(window.currentTimer);
                resolveQuestion(gameCode);
              }
            }, 500);
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
        setTimeLeft(0);
        setAnswered(true); // Ensure players who didn't click still see the result
      } else if (data.state === 'leaderboard') {
        clearInterval(window.currentTimer);
        if (currentScreenRef.current !== 'leaderboard') {
          playSelect();
          navigate('leaderboard');
        }
      } else if (data.state === 'loading') {
        clearInterval(window.currentTimer);
        if (currentScreenRef.current !== 'loading') {
          navigate('loading');
        }
      } else if (data.state === 'podium' && currentScreenRef.current !== 'podium') {
        playWin();
        navigate('podium');
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_is_host');
        sessionStorage.removeItem('sabi_is_spectator');
      }
    });

    // Catch tab visibility changes (e.g. host switches to WhatsApp and back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && gameRef.current && gameRef.current.state === 'question') {
        const startedAt = gameRef.current.startedAt;
        const timerDuration = gameRef.current.config?.timerMode || 15;
        if (startedAt) {
          const elapsed = Date.now() - startedAt;
          const totalMs = timerDuration * 1000;
          const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
          setTimeLeft(remaining);
          if (isHost && elapsed >= totalMs + 1500) {
            clearInterval(window.currentTimer);
            resolveQuestion(gameCode);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const unsubPlayers = onSnapshot(collection(db, 'games', gameCode, 'players'), (snapshot) => {
      const rawPlayers = snapshot.docs.map(d => ({ ...d.data(), docId: d.id }));

      // Deduplicate player documents by normalized email or case-insensitive name
      const playerMap = new Map();
      for (const p of rawPlayers) {
        const rawName = (p.name || '').trim();
        const rawEmail = (p.ggEmail || '').trim().toLowerCase();
        // Discard phantom blank/You docs if a named doc exists
        const key = rawEmail ? `email:${rawEmail}` : `name:${rawName.toLowerCase()}`;
        
        if (!playerMap.has(key)) {
          playerMap.set(key, p);
        } else {
          const existing = playerMap.get(key);
          const preferNew = (p.sessionId === sessionId) || 
                            (p.connected && !existing.connected) || 
                            ((p.score || 0) > (existing.score || 0));
          if (preferNew) {
            playerMap.set(key, p);
          }
        }
      }
      const playersList = Array.from(playerMap.values());

      const me = playersList.find(p => p.sessionId === sessionId || (player.name && (p.name || '').trim().toLowerCase() === player.name.trim().toLowerCase()));
      if (me) {
        setPlayer(prev => ({ 
          ...prev, 
          name: me.name || prev.name, 
          score: me.score ?? prev.score, 
          streak: me.streak ?? prev.streak, 
          roundPoints: me.roundPoints || 0, 
          banter: me.banter || prev.banter, 
          vehicle: me.vehicle || prev.vehicle, 
          color: me.color || prev.color 
        }));
        
        if (gameRef.current && gameRef.current.state === 'result' && chosenAnswer !== -1) {
           const wasCorrect = me.chosenAnswer === gameRef.current.questions[gameRef.current.currentQ].answer;
           setFlashColor(wasCorrect ? 'green' : 'red');
           if (wasCorrect) playCorrect(); else playWrong();
           setTimeout(() => setFlashColor(null), 300);
           if (wasCorrect) showStreakToast(me.streak);
        }
      }

      // Opponents MUST strictly exclude the local player by sessionId, matching name, and matching email
      const myName = (player.name || me?.name || '').trim().toLowerCase();
      const myEmail = (ggSession?.player?.email || me?.ggEmail || '').trim().toLowerCase();

      const others = playersList
        .filter(p => {
          if (p.sessionId === sessionId) return false;
          const pName = (p.name || '').trim().toLowerCase();
          const pEmail = (p.ggEmail || '').trim().toLowerCase();
          if (myName && pName && pName === myName) return false;
          if (myEmail && pEmail && pEmail === myEmail) return false;
          return true;
        })
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(window.currentTimer);
    };
  }, [gameCode, isHost, ggSession]);

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
    if (ggAccessState === 'denied') {
      showAlertModal('This experience is only available through GummyGum.', 'Not available here', null, { text: 'Back to GummyGum', url: 'https://gummygum.app' });
      return;
    }
    // 1. Instant optimistic state update to allow browser main thread to paint immediately (<5ms INP)
    setGameConfig(config);
    setIsHost(true);
    // Host never plays — always a spectator.
    setIsSpectator(true);
    sessionStorage.setItem('sabi_is_spectator', 'true');
    setPlayer(p => ({ ...p, name: config.hostName || 'HR Admin' }));
    navigate('lobby');

    // 2. Defer question array processing and network batch creation to next event loop frame
    setTimeout(async () => {
      try {
        let code = ggSession && ggSession.isHost && ggSession.roomCode ? ggSession.roomCode : '';
        if (!code) {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          for(let i=0; i<6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const selectedTopic = (config.topicPack || 'General Knowledge').toLowerCase().trim();
        let filteredPool = QUESTIONS.filter((q) => {
          const cat = (q.category || '').toLowerCase().trim();
          if (selectedTopic === 'tech' || selectedTopic === 'tech & innovation') {
            return cat === 'tech' || cat === 'tech & innovation';
          }
          return cat === selectedTopic;
        });
        if (filteredPool.length === 0) {
          filteredPool = [...QUESTIONS];
        }

        let pool = [...filteredPool].sort(() => Math.random() - 0.5);
        let generatedQuestions = [];
        while (generatedQuestions.length < (config.qCount || 12)) {
          const target = config.qCount || 12;
          const remaining = target - generatedQuestions.length;
          generatedQuestions = [...generatedQuestions, ...pool.slice(0, remaining)];
          pool = [...filteredPool].sort(() => Math.random() - 0.5);
        }

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

        // No player doc for the host — they present, never play.

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
  const claimHostedRoom = (code, hostName, onSettled) => {
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
        if (gameData.invitedCount) setInvitedCount(gameData.invitedCount);
        else if (gameData.config?.invitedCount) setInvitedCount(gameData.config.invitedCount);
        setIsHost(true);
        sessionStorage.setItem('sabi_game_code', code);
        sessionStorage.setItem('sabi_is_host', 'true');

        // Clear the previous tab's stale player doc so the host isn't doubled up.
        const staleHostSessionId = gameData.hostSessionId;
        if (staleHostSessionId && staleHostSessionId !== sessionId) {
          await deleteDoc(doc(db, 'games', code, 'players', staleHostSessionId)).catch(() => undefined);
        }

        await updateDoc(doc(db, 'games', code), { hostSessionId: sessionId });

        // The host never plays their own session — see createGame() above.
        setIsSpectator(true);
        sessionStorage.setItem('sabi_is_spectator', 'true');
        setPlayer((p) => ({ ...p, name }));

        navigate(gameData.state);
      } catch (err) {
        showAlertModal('Failed to join: ' + err.message, 'Join Error');
      } finally {
        onSettled?.();
      }
    }, 0);
  };

  const joinGameWithCode = (code, customName, onSettled, ggEmail) => {
    if (ggAccessState === 'denied') {
      showAlertModal('This experience is only available through GummyGum.', 'Not available here', null, { text: 'Back to GummyGum', url: 'https://gummygum.app' });
      onSettled?.();
      return;
    }
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
        const normalizedGgEmail = ggEmail ? ggEmail.toLowerCase().trim() : null;

        const pSnap = await getDocs(collection(db, 'games', code, 'players'));

        // Reconnect via a stale ggEmail match or name match, so a closed-tab or reloaded rejoin reclaims rather than collides.
        let staleDoc = null;
        if (normalizedGgEmail) {
          staleDoc = pSnap.docs.find(d => (d.data().ggEmail || '').toLowerCase().trim() === normalizedGgEmail && d.id !== sessionId) || null;
        }
        if (!staleDoc && requestedName && requestedName.trim()) {
          staleDoc = pSnap.docs.find(d => (d.data().name || '').toLowerCase().trim() === requestedName.toLowerCase().trim() && d.id !== sessionId) || null;
        }

        if (!staleDoc && requestedName && requestedName.trim()) {
          const nameExists = pSnap.docs.some(d => {
             const p = d.data();
             return p.name.toLowerCase().trim() === requestedName.toLowerCase().trim() && p.sessionId !== sessionId && p.connected !== false;
          });

          if (nameExists) {
             showAlertModal("That nickname is already taken! Please choose another.", "Nickname Taken");
             return;
          }
        }

        setGameCode(code);
        setGameConfig(gameData.config);
        setGameQuestions(gameData.questions);

        const isSavedHost = sessionStorage.getItem('sabi_is_host') === 'true' && gameData.hostSessionId === sessionId;
        setIsHost(isSavedHost);
        sessionStorage.setItem('sabi_game_code', code);
        sessionStorage.setItem('sabi_joined_room', code);
        if (!isSavedHost) sessionStorage.setItem('sabi_is_host', 'false');

        setIsSpectator(false);
        sessionStorage.setItem('sabi_is_spectator', 'false');

        const playerRef = doc(db, 'games', code, 'players', sessionId);
        let finalVehicle = player.vehicle;
        let finalName = requestedName || player.name;

        if (staleDoc) {
          const prior = staleDoc.data();
          finalVehicle = prior.vehicle || player.vehicle;
          finalName = requestedName || prior.name || player.name;
          setPlayer((p) => ({ ...p, name: finalName, vehicle: finalVehicle }));
          await deleteDoc(doc(db, 'games', code, 'players', staleDoc.id)).catch(() => undefined);
          await setDoc(playerRef, {
            ...player,
            name: finalName,
            vehicle: finalVehicle,
            sessionId,
            ...(normalizedGgEmail && { ggEmail: normalizedGgEmail }),
            score: prior.score ?? player.score ?? 0,
            streak: prior.streak ?? player.streak ?? 0,
            answered: prior.answered ?? false,
            chosenAnswer: prior.chosenAnswer ?? -1,
            connected: true
          });
        } else if (!pDoc.exists()) {
          await setDoc(playerRef, {
            ...player,
            name: finalName,
            vehicle: finalVehicle,
            sessionId,
            ...(normalizedGgEmail && { ggEmail: normalizedGgEmail }),
            score: player.score ?? 0,
            streak: player.streak ?? 0,
            answered: false,
            chosenAnswer: -1,
            connected: true
          });
        } else {
          await updateDoc(playerRef, {
            connected: true,
            ...(requestedName && { name: requestedName }),
            ...(normalizedGgEmail && { ggEmail: normalizedGgEmail })
          });
        }

        if (normalizedGgEmail) {
          localStorage.setItem(`sabi_avatar_${normalizedGgEmail}`, finalVehicle);
          localStorage.setItem(`sabi_name_${normalizedGgEmail}`, finalName);
          localStorage.setItem(`sabi_joined_${code}_${normalizedGgEmail}`, 'true');
        }

        if (gameData.state !== 'lobby') {
          setStreakToast('Joining a game in progress…');
          setTimeout(() => setStreakToast(null), 2200);
        }
        navigate(gameData.state);
      } catch(err) {
        showAlertModal("Failed to join: " + err.message, "Join Error");
      } finally {
        onSettled?.();
      }
    }, 0);
  };

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
      try {
        const playersSnap = await getDocs(collection(db, 'games', gameCode, 'players'));
        if (!playersSnap.empty) {
          const batch = writeBatch(db);
          for (const d of playersSnap.docs) {
            batch.update(d.ref, { answered: false, chosenAnswer: -1 });
          }
          await batch.commit();
        }

        const totalQ = gameQuestions.length || 12;
        await updateDoc(doc(db, 'games', gameCode), {
          state: 'loading',
          loadingMessage: `Preparing for Round 1 of ${totalQ}...`,
          currentQ: 0
        });

        setTimeout(async () => {
          try {
            await updateDoc(doc(db, 'games', gameCode), {
              state: 'question',
              currentQ: 0,
              startedAt: Date.now(),
              bonusRound: Math.random() < 0.25,
              firstBloodQ: false
            });
          } catch (e) {
            console.error('startRace question transition error:', e);
          }
        }, 1800);
      } catch (err) {
        console.error('startRace error:', err);
      }
    }, 0);
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setAnswered(true);
    setChosenAnswer(idx);
    
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'games', gameCode, 'players', sessionId), {
          answered: true,
          chosenAnswer: optionMapRef.current[idx],
          answeredAt: Date.now()
        });
      } catch (e) {
        console.warn('Answer update failed:', e);
      }
    }, 0);
  };

  const resolveQuestion = async (code) => {
    if (resolvingRef.current) return;
    resolvingRef.current = true;
    clearInterval(window.currentTimer);

    try {
      await updateDoc(doc(db, 'games', code), { state: 'result' });

      const gameSnap = await getDoc(doc(db, 'games', code));
      if (!gameSnap.exists()) {
        resolvingRef.current = false;
        return;
      }
      const game = gameSnap.data();
      const currentQData = game.questions?.[game.currentQ];
      const correctIndex = currentQData?.answer ?? 0;

      const pSnap = await getDocs(collection(db, 'games', code, 'players'));
      let firstBloodUsed = false;

      // Commit ALL player score updates in ONE atomic batch to avoid 50+ individual HTTP writes
      if (!pSnap.empty) {
        const batch = writeBatch(db);
        for (const d of pSnap.docs) {
          const p = d.data();
          if (p.answered && p.chosenAnswer === correctIndex) {
            let pts = 100;
            const timeTaken = p.answeredAt ? (p.answeredAt - game.startedAt) / 1000 : 15;
            const tLeft = Math.max(0, (game.config?.timerMode || 15) - timeTaken);

            if (tLeft >= 11) pts += 50;
            else if (tLeft >= 6) pts += 25;

            if (!firstBloodUsed) { pts += 20; firstBloodUsed = true; }
            if (game.bonusRound) pts *= 2;

            let streakMult = p.streak >= 7 ? 2.5 : p.streak >= 5 ? 2.0 : p.streak >= 3 ? 1.5 : p.streak >= 2 ? 1.2 : 1.0;
            pts = Math.round(pts * streakMult);

            batch.update(d.ref, { score: (p.score || 0) + pts, streak: (p.streak || 0) + 1, roundPoints: pts });
          } else {
            batch.update(d.ref, { streak: 0, roundPoints: 0 });
          }
        }
        await batch.commit();
      }

      setTimeout(async () => {
        try {
          await updateDoc(doc(db, 'games', code), {
            state: 'leaderboard',
            leaderboardStartedAt: Date.now(),
            isFinalRound: (game.currentQ ?? 0) + 1 >= (game.questions?.length || 1)
          });
        } catch (e) {
          console.error('Leaderboard transition error:', e);
        } finally {
          resolvingRef.current = false;
        }
      }, 1800);
    } catch (err) {
      console.error('resolveQuestion error:', err);
      resolvingRef.current = false;
    }
  };

  const nextQuestion = async () => {
    if (!isHost || !gameCode) return;
    clearInterval(window.currentTimer);
    try {
      const snap = await getDocs(collection(db, 'games', gameCode, 'players'));
      if (!snap.empty) {
        const batch = writeBatch(db);
        for (const d of snap.docs) {
          batch.update(d.ref, { answered: false, chosenAnswer: -1, roundPoints: 0 });
        }
        await batch.commit();
      }

      const gameSnap = await getDoc(doc(db, 'games', gameCode));
      if (!gameSnap.exists()) return;
      const gameData = gameSnap.data();
      const nextQIndex = (gameData.currentQ ?? 0) + 1;
      const totalQCount = gameData.questions?.length || 1;

      if (nextQIndex >= totalQCount) {
        await updateDoc(doc(db, 'games', gameCode), {
          state: 'loading',
          loadingMessage: 'Preparing Final Standings...'
        });
        setTimeout(async () => {
          try {
            await updateDoc(doc(db, 'games', gameCode), { state: 'podium', isFinal: true });
          } catch (e) {
            console.error('Podium transition error:', e);
          }
        }, 1800);
      } else {
        await updateDoc(doc(db, 'games', gameCode), {
          state: 'loading',
          currentQ: nextQIndex,
          loadingMessage: `Preparing for Round ${nextQIndex + 1} of ${totalQCount}...`
        });

        setTimeout(async () => {
          try {
            await updateDoc(doc(db, 'games', gameCode), {
              state: 'question',
              currentQ: nextQIndex,
              startedAt: Date.now(),
              bonusRound: Math.random() < 0.25,
              firstBloodQ: false
            });
          } catch (e) {
            console.error('Next question transition error:', e);
          }
        }, 1600);
      }
    } catch (err) {
      console.error('Failed to advance to next question:', err);
    }
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
      if (ggSession) {
        window.location.href = 'https://gummygum.app';
      } else {
        navigate('home');
      }
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
      flashColor, streakToast, loadingMessage, leaderboardStartedAt,
      startRace, nextQuestion, resolveQuestion, handleAnswer, isHost, cancelGame, kickPlayer, isSpectator,
      hostSettings, setHostSettings,
      ggSession, ggAccessState, ggRouted, invitedCount,
      alertModal, showAlertModal, closeAlertModal
    }}>
      {children}
    </GameContext.Provider>
  );
};
