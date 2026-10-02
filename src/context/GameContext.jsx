import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, collection, setDoc, getDoc, updateDoc, onSnapshot, getDocs, deleteDoc, writeBatch, runTransaction } from 'firebase/firestore';
import { INITIAL_PLAYER, QUESTIONS } from '../constants';
import { playJoin, playStart, playTick, playCorrect, playWrong, playWin, playSelect } from '../utils/audio';
import { resolveGummyGumLaunch, reportGummyGumResult, reportGummyGumCancel, returnToGummyGum, endGummyGumSession } from '../lib/gummygumSession';

const GameContext = createContext();

const LOBBY_EXPIRY_MS = 20 * 60 * 1000;
// A game stuck mid-play with no connected client for this long is abandoned, not just a long-running race.
const ABANDON_THRESHOLD_MS = 3 * 60 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 60 * 1000;
const IN_PROGRESS_STATES = ['loading', 'question', 'result', 'leaderboard'];
const RESULT_REVEAL_MS = 1800;
// Per-run fields cleared when a reused PIN's room is reset for a new hosted session; everything else is hub setup.
const ROOM_RUNTIME_FIELDS = [
  'state', 'currentQ', 'startedAt', 'createdAt', 'lastActivity', 'leaderboardStartedAt', 'phaseEndsAt',
  'loadingNext', 'loadingMessage', 'scoredQ', 'isFinal', 'isFinalRound', 'bonusRound', 'firstBloodQ',
  'abandoned', 'hostSessionId', 'hostedSessionId',
];

const isClosedRoom = (g, now = Date.now()) => {
  if (g.state === 'expired' || g.state === 'podium') return true;
  if (g.state === 'lobby') return Boolean(g.createdAt) && now - g.createdAt >= LOBBY_EXPIRY_MS;
  if (!IN_PROGRESS_STATES.includes(g.state)) return false;
  const last = Math.max(g.lastActivity || 0, g.startedAt || 0, g.leaderboardStartedAt || 0, g.createdAt || 0);
  return last > 0 && now - last >= ABANDON_THRESHOLD_MS;
};

// The hub reuses a PIN for re-runs, so the room under it may belong to an earlier hosted session.
const isFromEarlierRoom = (g, hostedSessionId) => {
  if (!g || !hostedSessionId) return false;
  if (g.hostedSessionId) return g.hostedSessionId !== hostedSessionId;
  return isClosedRoom(g);
};

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
  const myDocRef = useRef(null);
  const gameRef = useRef(null);
  const resolvingRef = useRef(false);
  const hasSeenSelfInPlayersRef = useRef(false);
  const flashedQRef = useRef(-1);
  
  const [isHost, setIsHost] = useState(false);
  const [isSpectator, setIsSpectator] = useState(() => sessionStorage.getItem('sabi_is_spectator') === 'true');
  const isSpectatorRef = useRef(isSpectator);
  isSpectatorRef.current = isSpectator;
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
  // Firestore fires the local snapshot for our own deleteDoc before it resolves; without this the listener navigates away before the hub is told.
  const hostExitInProgressRef = useRef(false);
  const [sessionEndedCompleted, setSessionEndedCompleted] = useState(false);
  const [awaitingHost, setAwaitingHost] = useState(false);

  const [alertModal, setAlertModal] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [sessionExpiredContext, setSessionExpiredContext] = useState('lobby');
  const abandonReportedRef = useRef(false);

  const joinedKey = (code, email) => ['sabi_joined', code, ggSession?.hostedSessionId, email].filter(Boolean).join('_');

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
      const roomCode = ggSession.roomCode;
      const hostedSessionId = ggSession.hostedSessionId;
      if (!hostedSessionId) {
        routeParticipant(roomCode);
        return;
      }
      // Wait until the host has (re)created this hosted session's room under the reused PIN.
      let settled = false;
      let unsub = () => {};
      unsub = onSnapshot(doc(db, 'games', roomCode), (snap) => {
        if (settled) return;
        const g = snap.exists() ? snap.data() : null;
        if (!g || isFromEarlierRoom(g, hostedSessionId)) {
          setAwaitingHost(true);
          return;
        }
        settled = true;
        unsub();
        setAwaitingHost(false);
        routeParticipant(roomCode);
      }, () => {
        if (settled) return;
        settled = true;
        setAwaitingHost(false);
        routeParticipant(roomCode);
      });
      return () => unsub();
    }
    getDoc(doc(db, 'games', ggSession.roomCode)).then(async (existing) => {
      if (existing.exists()) {
        const hostedSessionId = ggSession.hostedSessionId;
        const data = existing.data();
        try {
          if (isFromEarlierRoom(data, hostedSessionId)) {
            await resetRoomForHostedSession(ggSession.roomCode, data, hostedSessionId);
          } else if (hostedSessionId && !data.hostedSessionId) {
            await updateDoc(doc(db, 'games', ggSession.roomCode), { hostedSessionId });
          }
        } catch (err) {
          console.error('Failed to prepare room for this hosted session:', err);
        }
        claimHostedRoom(ggSession.roomCode, ggSession.player?.name, () => setGgRouted(true));
      } else {
        navigate('create');
        setGgRouted(true);
      }
    });
  }, [ggSession, ggAccessState]);

  const resetRoomForHostedSession = async (code, data, hostedSessionId) => {
    const batch = writeBatch(db);
    const pSnap = await getDocs(collection(db, 'games', code, 'players'));
    pSnap.docs.forEach((d) => batch.delete(d.ref));
    const setup = Object.fromEntries(Object.entries(data).filter(([k]) => !ROOM_RUNTIME_FIELDS.includes(k)));
    batch.set(doc(db, 'games', code), {
      ...setup,
      code,
      hostSessionId: null,
      hostedSessionId,
      state: 'lobby',
      currentQ: 0,
      startedAt: null,
      createdAt: Date.now(),
    });
    await batch.commit();
  };

  const routeParticipant = (roomCode) => {
    const email = (ggSession.player?.email || '').toLowerCase().trim();
    const savedCode = sessionStorage.getItem('sabi_game_code');
    const savedJoined = sessionStorage.getItem('sabi_joined_room');
    const localJoined = email ? localStorage.getItem(joinedKey(roomCode, email)) === 'true' : false;

    // 1. Fast local check (sessionStorage or localStorage for this room)
    if (savedCode === roomCode || savedJoined === roomCode || localJoined) {
      const savedAvatar = (email && localStorage.getItem(`sabi_avatar_${email}`)) || player.vehicle;
      const savedName = ggSession.player?.name || (email && localStorage.getItem(`sabi_name_${email}`)) || player.name;
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
        return email ? docEmail === email : d.id === sessionId;
      });

      if (existingPlayer) {
        const priorData = existingPlayer.data();
        const restoredAvatar = priorData.vehicle || (email && localStorage.getItem(`sabi_avatar_${email}`)) || player.vehicle;
        const restoredName = ggSession.player?.name || priorData.name || (email && localStorage.getItem(`sabi_name_${email}`)) || player.name;

        if (email) {
          localStorage.setItem(joinedKey(roomCode, email), 'true');
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
        const initialName = ggSession.player?.name || (email && localStorage.getItem(`sabi_name_${email}`)) || player.name || '';
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
  };

  const buildGgReport = () => {
    const roster = opponents.map((o) => ({
      name: o.name,
      score: o.score,
      streak: o.streak,
      isHost: false,
    })).sort((a, b) => b.score - a.score);
    return { gameCode, hostName: player.name, participantCount: roster.length, leaderboard: roster };
  };

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
    if (gameState !== 'podium' || ggReportedRef.current || !ggSession || ggSession.reported || !isHost) return;
    // After a host reload the room snapshot can land before the roster's; never report an empty board.
    if (opponents.length === 0) return;
    ggReportedRef.current = true;
    reportGummyGumResult(buildGgReport());
  }, [gameState, ggSession, isHost, player.name, opponents, gameCode]);

  useEffect(() => {
    if (!gameCode) return;

    const unsubGame = onSnapshot(doc(db, 'games', gameCode), (snapshot) => {
      if (!snapshot.exists()) {
        if (hostExitInProgressRef.current) return;
        const endedAfterCompletion = gameRef.current?.state === 'podium';
        gameRef.current = null;
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_is_host');
        setGameCode('');

        if (ggSession?.isHost) {
          // GummyGum is the source of this cancellation (or already knows
          // about it) — just send the host back to the hub, no need to
          // re-hit the close endpoint.
          returnToGummyGum();
        } else if (ggSession) {
          // Participant: route to a dedicated terminal screen rather than
          // leaving them on a frozen lobby/question/leaderboard screen with
          // just a modal on top — window.close() silently no-ops for tabs
          // not opened via script, so it can't be relied on here.
          setSessionEndedCompleted(endedAfterCompletion);
          navigate('session-ended');
        } else {
          showAlertModal('The Race Director cancelled the session.', 'Session Cancelled');
          navigate('home');
        }
        return;
      }

      const data = snapshot.data();
      if (ggSession && !ggSession.isHost && ggSession.hostedSessionId && data.hostedSessionId && data.hostedSessionId !== ggSession.hostedSessionId) {
        // The host reset this PIN for a newer hosted session, so this participant's session is over.
        const endedAfterCompletion = gameRef.current?.state === 'podium';
        gameRef.current = null;
        sessionStorage.removeItem('sabi_game_code');
        setGameCode('');
        setSessionEndedCompleted(endedAfterCompletion);
        navigate('session-ended');
        return;
      }
      gameRef.current = data;

      clearTimeout(window.phaseTimer);
      if (data.state === 'expired') {
        clearInterval(window.currentTimer);
        setSessionExpiredContext(data.abandoned ? 'game' : 'lobby');
        setIsSessionExpired(true);
        if (data.abandoned && ggSession?.isHost && !abandonReportedRef.current) {
          abandonReportedRef.current = true;
          reportGummyGumCancel();
        }
        return;
      }
      if (data.state === 'lobby' && data.createdAt && Date.now() - data.createdAt >= LOBBY_EXPIRY_MS) {
        setSessionExpiredContext('lobby');
        setIsSessionExpired(true);
        return;
      }
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
          // A rejoining player who already answered this question must not be able to answer it again.
          const mine = myDocRef.current;
          if (mine?.answered && typeof mine.chosenAnswer === 'number' && mine.chosenAnswer >= 0) {
            setAnswered(true);
            setChosenAnswer(newOptionMap.indexOf(mine.chosenAnswer));
          }
          const clientAnswerIndex = newOptionMap.indexOf(data.questions[data.currentQ].answer);

          setGameQuestions(prev => {
            const next = [...prev];
            const src = data.questions[data.currentQ];
            next[data.currentQ] = {
              ...src,
              opts: shuffledOpts,
              ...(Array.isArray(src.optImages) && { optImages: newOptionMap.map(o => src.optImages[o]) }),
              answer: clientAnswerIndex 
            };
            return next;
          });
        }
      } else if (data.state === 'result') {
        clearInterval(window.currentTimer);
        setTimeLeft(0);
        setAnswered(true); // Ensure players who didn't click still see the result
        if (isHost) {
          // A numeric scoredQ lagging currentQ means the host reloaded before scoring committed; legacy docs have none.
          if (typeof data.scoredQ === 'number' && data.scoredQ !== data.currentQ) resolveQuestion(gameCode);
          else schedulePhaseAdvance(gameCode, data);
        }
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
        if (isHost) schedulePhaseAdvance(gameCode, data);
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

      // GummyGum invitees can share a name, so only a standalone join may fall back to a name match.
      const me = playersList.find(p => p.sessionId === sessionId)
        || (!ggSession && player.name ? playersList.find(p => (p.name || '').trim().toLowerCase() === player.name.trim().toLowerCase()) : undefined);
      myDocRef.current = me || null;
      if (me) {
        hasSeenSelfInPlayersRef.current = true;
        if (me.answered && me.chosenAnswer >= 0 && gameRef.current?.state === 'question' && shuffledQRef.current === gameRef.current.currentQ) {
          setAnswered(true);
          setChosenAnswer(optionMapRef.current.indexOf(me.chosenAnswer));
        }
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

        // chosenAnswer state is stale in this listener's closure, so read the answer from the doc.
        const g = gameRef.current;
        if (g && g.state === 'result' && me.answered && me.chosenAnswer >= 0 && flashedQRef.current !== g.currentQ) {
           flashedQRef.current = g.currentQ;
           const wasCorrect = me.chosenAnswer === g.questions[g.currentQ].answer;
           setFlashColor(wasCorrect ? 'green' : 'red');
           if (wasCorrect) playCorrect(); else playWrong();
           setTimeout(() => setFlashColor(null), 300);
           if (wasCorrect) showStreakToast(me.streak);
        }
      } else if (hasSeenSelfInPlayersRef.current && !isHost && gameRef.current?.state === 'lobby') {
        // Was present in the roster before, now gone while still in the lobby — the
        // host removed us. Without this, we'd just sit on the lobby screen forever.
        hasSeenSelfInPlayersRef.current = false;
        sessionStorage.removeItem('sabi_game_code');
        sessionStorage.removeItem('sabi_joined_room');
        sessionStorage.removeItem('sabi_is_host');
        sessionStorage.removeItem('sabi_is_spectator');
        setGameCode('');
        showAlertModal(
          'The host has removed you from this session.',
          'Removed from lobby',
          null,
          { text: 'You can close this tab now', onClick: () => {} }
        );
      }

      // Opponents MUST strictly exclude the local player by sessionId, matching name, and matching email
      const myName = (player.name || me?.name || '').trim().toLowerCase();
      const myEmail = (ggSession?.player?.email || me?.ggEmail || '').trim().toLowerCase();

      const others = playersList
        .filter(p => {
          if (p.sessionId === sessionId) return false;
          const pName = (p.name || '').trim().toLowerCase();
          const pEmail = (p.ggEmail || '').trim().toLowerCase();
          if (!ggSession && myName && pName && pName === myName) return false;
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
      clearTimeout(window.phaseTimer);
    };
  }, [gameCode, isHost, ggSession]);

  // Abandonment check runs once before this client's own heartbeat starts, so a returning client can't mask an abandoned game with its first write.
  useEffect(() => {
    if (!gameCode) return;
    const gameDocRef = doc(db, 'games', gameCode);
    let heartbeatInterval;
    let stopped = false;

    const lobbyTimer = setInterval(() => {
      const g = gameRef.current;
      if (g?.state === 'lobby' && g.createdAt && Date.now() - g.createdAt >= LOBBY_EXPIRY_MS) {
        setSessionExpiredContext('lobby');
        setIsSessionExpired(true);
      }
    }, 10000);

    getDoc(gameDocRef).then((snap) => {
      if (stopped || !snap.exists()) return;
      const g = snap.data();
      const lastActivity = Math.max(g.lastActivity || 0, g.startedAt || 0, g.leaderboardStartedAt || 0, g.createdAt || 0);
      if (
        IN_PROGRESS_STATES.includes(g.state) &&
        lastActivity > 0 &&
        Date.now() - lastActivity >= ABANDON_THRESHOLD_MS
      ) {
        updateDoc(gameDocRef, { state: 'expired', abandoned: true }).catch(() => {});
        setSessionExpiredContext('game');
        setIsSessionExpired(true);
        return;
      }

      // Host only: every player writing the game doc kept colliding with the host's phase transactions.
      const beat = () => {
        if (!isSpectatorRef.current || !IN_PROGRESS_STATES.includes(gameRef.current?.state)) return;
        updateDoc(gameDocRef, { lastActivity: Date.now() }).catch(() => {});
      };
      beat();
      heartbeatInterval = setInterval(beat, HEARTBEAT_INTERVAL_MS);
    }).catch((err) => console.error('Failed to load game activity:', err));

    return () => {
      stopped = true;
      clearInterval(lobbyTimer);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
  }, [gameCode]);

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

        // Afribase runs as a fixed sequence: general knowledge first, then dashboard know-how.
        const keepOrder = selectedTopic === 'afribase';
        let pool = keepOrder ? [...filteredPool] : [...filteredPool].sort(() => Math.random() - 0.5);
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

        if (ggSession?.isHost && ggSession.roomCode) {
          // Deleting the room doc leaves its players subcollection behind, and the hub reuses this PIN.
          const stalePlayers = await getDocs(collection(db, 'games', code, 'players'));
          stalePlayers.docs.forEach((d) => batch.delete(d.ref));
        }

        batch.set(doc(db, 'games', code), {
          code,
          hostSessionId: sessionId,
          hostedSessionId: ggSession?.hostedSessionId || null,
          config,
          questions: generatedQuestions,
          state: 'lobby',
          currentQ: 0,
          startedAt: null,
          createdAt: Date.now()
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
          if (ggSession) {
            // Stale GummyGum session pointing at a room the host already ended — lock out instead of falling through to native Home.
            sessionStorage.removeItem('sabi_game_code');
            sessionStorage.removeItem('sabi_joined_room');
            sessionStorage.removeItem('sabi_is_host');
            sessionStorage.removeItem('sabi_is_spectator');
            setGgSession(null);
            setGgAccessState('denied');
          } else {
            showAlertModal("Game not found or invalid code!", "Invalid Game PIN");
          }
          return;
        }

        const gameData = gameDoc.data();
        const requestedName = customName || player.name;
        const normalizedGgEmail = ggEmail ? ggEmail.toLowerCase().trim() : null;

        const pSnap = await getDocs(collection(db, 'games', code, 'players'));

        const isGgJoin = Boolean(ggSession);

        // Reconnect via a stale ggEmail match (or, standalone only, a name match) so a closed-tab or reloaded rejoin reclaims rather than collides.
        let staleDoc = null;
        if (normalizedGgEmail) {
          staleDoc = pSnap.docs.find(d => (d.data().ggEmail || '').toLowerCase().trim() === normalizedGgEmail && d.id !== sessionId) || null;
        }
        if (!staleDoc && !isGgJoin && requestedName && requestedName.trim()) {
          staleDoc = pSnap.docs.find(d => (d.data().name || '').toLowerCase().trim() === requestedName.toLowerCase().trim() && d.id !== sessionId) || null;
        }

        let uniqueName = requestedName;
        if (isGgJoin && requestedName && requestedName.trim()) {
          const base = requestedName.trim();
          const ownIds = new Set([sessionId, staleDoc?.id].filter(Boolean));
          const taken = new Set(
            pSnap.docs.filter(d => !ownIds.has(d.id)).map(d => (d.data().name || '').toLowerCase().trim())
          );
          const priorName = (staleDoc?.data().name || pSnap.docs.find(d => d.id === sessionId)?.data().name || '').trim();
          const priorLower = priorName.toLowerCase();
          const baseLower = base.toLowerCase();
          const isOwnVariant = priorLower === baseLower || (priorLower.startsWith(`${baseLower} `) && /^\d+$/.test(priorLower.slice(baseLower.length + 1)));
          if (isOwnVariant && !taken.has(priorLower)) {
            uniqueName = priorName;
          } else if (taken.has(baseLower)) {
            // Invite names are read-only, so a duplicate gets a suffix instead of a dead-end error.
            let n = 2;
            while (taken.has(`${base} ${n}`.toLowerCase())) n++;
            uniqueName = `${base} ${n}`;
          } else {
            uniqueName = base;
          }
        }

        if (!isGgJoin && !staleDoc && requestedName && requestedName.trim()) {
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
        let finalName = uniqueName || player.name;

        const existingPlayerDoc = pSnap.docs.find((d) => d.id === sessionId);

        if (staleDoc) {
          const prior = staleDoc.data();
          finalVehicle = prior.vehicle || player.vehicle;
          finalName = uniqueName || prior.name || player.name;
          setPlayer((p) => ({ ...p, name: finalName, vehicle: finalVehicle }));
          await deleteDoc(doc(db, 'games', code, 'players', staleDoc.id)).catch(() => undefined);
          await setDoc(playerRef, {
            ...player,
            ...prior,
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
        } else if (!existingPlayerDoc) {
          setPlayer((p) => ({ ...p, name: finalName }));
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
          if (uniqueName) setPlayer((p) => ({ ...p, name: finalName }));
          await updateDoc(playerRef, {
            connected: true,
            ...(uniqueName && { name: uniqueName }),
            ...(normalizedGgEmail && { ggEmail: normalizedGgEmail })
          });
        }

        if (normalizedGgEmail) {
          localStorage.setItem(`sabi_avatar_${normalizedGgEmail}`, finalVehicle);
          localStorage.setItem(`sabi_name_${normalizedGgEmail}`, finalName);
          localStorage.setItem(joinedKey(code, normalizedGgEmail), 'true');
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
        const gameDocRef = doc(db, 'games', gameCode);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(gameDocRef);
          if (!snap.exists() || snap.data().state !== 'lobby') return;
          tx.update(gameDocRef, {
            state: 'loading',
            loadingMessage: `Preparing for Round 1 of ${totalQ}...`,
            loadingNext: 'question',
            phaseEndsAt: Date.now() + 1800,
            scoredQ: -1,
            currentQ: 0
          });
        });
      } catch (err) {
        console.error('startRace error:', err);
      }
    }, 0);
  };

  const handleAnswer = (idx) => {
    if (answered || !gameRef.current) return;
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

  // Host phase deadlines live in phaseEndsAt so a reloaded host resumes them; the transaction check prevents double-advancing.
  const schedulePhaseAdvance = (code, data) => {
    const endsAt = data.phaseEndsAt ?? null;
    const delay = Math.max(0, (endsAt || 0) - Date.now());
    window.phaseTimer = setTimeout(() => advancePhase(code, data.state, endsAt), delay);
  };

  const advancePhase = async (code, expectedState, expectedEndsAt, attempt = 0) => {
    const gameDocRef = doc(db, 'games', code);
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(gameDocRef);
        if (!snap.exists()) return;
        const g = snap.data();
        if (g.state !== expectedState || (g.phaseEndsAt ?? null) !== expectedEndsAt) return;

        if (g.state === 'loading') {
          const next = g.loadingNext || (g.isFinalRound ? 'podium' : 'question');
          if (next === 'podium') {
            tx.update(gameDocRef, { state: 'podium', isFinal: true, phaseEndsAt: null });
          } else {
            tx.update(gameDocRef, {
              state: 'question',
              currentQ: g.currentQ ?? 0,
              startedAt: Date.now(),
              bonusRound: Math.random() < 0.25,
              firstBloodQ: false,
              phaseEndsAt: null
            });
          }
        } else if (g.state === 'result') {
          tx.update(gameDocRef, {
            state: 'leaderboard',
            leaderboardStartedAt: Date.now(),
            isFinalRound: (g.currentQ ?? 0) + 1 >= (g.questions?.length || 1),
            phaseEndsAt: null
          });
        }
      });
    } catch (e) {
      console.error('Phase advance error:', e);
      // A lost transaction race must not freeze the game; the state check makes a late retry a no-op.
      if (attempt < 5) {
        window.phaseTimer = setTimeout(() => advancePhase(code, expectedState, expectedEndsAt, attempt + 1), 1000);
      }
    }
  };

  const resolveQuestion = async (code) => {
    if (resolvingRef.current) return;
    resolvingRef.current = true;
    clearInterval(window.currentTimer);
    const gameDocRef = doc(db, 'games', code);
    const needsScoring = (g) => g.state === 'result' && g.scoredQ !== g.currentQ;

    try {
      // Reveal before scoring so the players listener sees 'result' when scores land (drives the answer flash).
      const proceed = await runTransaction(db, async (tx) => {
        const snap = await tx.get(gameDocRef);
        if (!snap.exists()) return false;
        const g = snap.data();
        if (g.state === 'question') {
          tx.update(gameDocRef, { state: 'result' });
          return true;
        }
        return needsScoring(g);
      });
      if (!proceed) return;

      const pSnap = await getDocs(collection(db, 'games', code, 'players'));

      // scoredQ commits atomically with the scores, so a reloaded host can never score a round twice.
      await runTransaction(db, async (tx) => {
        const gameSnap = await tx.get(gameDocRef);
        if (!gameSnap.exists()) return;
        const game = gameSnap.data();
        if (!needsScoring(game)) return;
        const correctIndex = game.questions?.[game.currentQ]?.answer ?? 0;
        const playerSnaps = await Promise.all(pSnap.docs.map((d) => tx.get(d.ref)));
        let firstBloodUsed = false;

        for (const ps of playerSnaps) {
          if (!ps.exists()) continue;
          const p = ps.data();
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

            tx.update(ps.ref, { score: (p.score || 0) + pts, streak: (p.streak || 0) + 1, roundPoints: pts });
          } else {
            tx.update(ps.ref, { streak: 0, roundPoints: 0 });
          }
        }
        tx.update(gameDocRef, { scoredQ: game.currentQ, phaseEndsAt: Date.now() + RESULT_REVEAL_MS });
      });
    } catch (err) {
      console.error('resolveQuestion error:', err);
    } finally {
      resolvingRef.current = false;
    }
  };

  const nextQuestion = async () => {
    if (!isHost || !gameCode) return;
    if (gameRef.current && gameRef.current.state !== 'leaderboard') return;
    clearInterval(window.currentTimer);
    const gameDocRef = doc(db, 'games', gameCode);
    try {
      const snap = await getDocs(collection(db, 'games', gameCode, 'players'));
      if (!snap.empty) {
        const batch = writeBatch(db);
        for (const d of snap.docs) {
          batch.update(d.ref, { answered: false, chosenAnswer: -1, roundPoints: 0 });
        }
        await batch.commit();
      }

      // Conditional on 'leaderboard' so a duplicate call (countdown + watchdog, or after a reload) cannot skip a question.
      await runTransaction(db, async (tx) => {
        const gameSnap = await tx.get(gameDocRef);
        if (!gameSnap.exists()) return;
        const gameData = gameSnap.data();
        if (gameData.state !== 'leaderboard') return;
        const nextQIndex = (gameData.currentQ ?? 0) + 1;
        const totalQCount = gameData.questions?.length || 1;

        if (nextQIndex >= totalQCount) {
          tx.update(gameDocRef, {
            state: 'loading',
            loadingMessage: 'Preparing Final Standings...',
            loadingNext: 'podium',
            phaseEndsAt: Date.now() + 1800
          });
        } else {
          tx.update(gameDocRef, {
            state: 'loading',
            currentQ: nextQIndex,
            loadingMessage: `Preparing for Round ${nextQIndex + 1} of ${totalQCount}...`,
            loadingNext: 'question',
            phaseEndsAt: Date.now() + 1600
          });
        }
      });
    } catch (err) {
      console.error('Failed to advance to next question:', err);
    }
  };

  const cancelGame = async () => {
    if (!isHost || hostExitInProgressRef.current) return;
    hostExitInProgressRef.current = true;
    const completed = gameRef.current?.state === 'podium';
    clearTimeout(window.phaseTimer);
    clearInterval(window.currentTimer);
    try {
      await deleteDoc(doc(db, 'games', gameCode));
    } catch (err) {
      console.error('Failed to delete game room:', err);
    }
    sessionStorage.removeItem('sabi_game_code');
    sessionStorage.removeItem('sabi_is_host');
    sessionStorage.removeItem('sabi_joined_room');
    if (ggSession) {
      const hub = await endGummyGumSession({ completed, finalReport: completed ? buildGgReport() : undefined });
      window.location.href = hub;
    } else {
      setGameCode('');
      hostExitInProgressRef.current = false;
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
      currentScreen, navigate, sessionId,
      player, setPlayer,
      opponents,
      gameCode, createGame, joinGameWithCode, gameConfig, gameQuestions,
      gameState, currentQ, timeLeft, answered, bonusRound, chosenAnswer,
      flashColor, streakToast, loadingMessage, leaderboardStartedAt,
      startRace, nextQuestion, resolveQuestion, handleAnswer, isHost, cancelGame, kickPlayer, isSpectator, sessionEndedCompleted,
      hostSettings, setHostSettings,
      ggSession, ggAccessState, ggRouted, awaitingHost, invitedCount,
      alertModal, showAlertModal, closeAlertModal,
      isSessionExpired, sessionExpiredContext
    }}>
      {children}
    </GameContext.Provider>
  );
};
