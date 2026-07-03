import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { QUESTIONS } from './constants.js';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory game state
const games = {};
// Map socket.id -> { code, sessionId }
const socketMap = {};

const generateGameCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for(let i=0; i<6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

const getStreakMult = (s) => {
  if (s >= 7) return 2.5;
  if (s >= 5) return 2.0;
  if (s >= 3) return 1.5;
  if (s >= 2) return 1.2;
  return 1.0;
};

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('create_game', (config, callback) => {
    let code = generateGameCode();
    while (games[code]) {
      code = generateGameCode();
    }

    // Generate questions for this session based on config
    let generatedQuestions = [];
    while (generatedQuestions.length < config.qCount) {
      generatedQuestions = [...generatedQuestions, ...QUESTIONS];
    }
    generatedQuestions = generatedQuestions.slice(0, config.qCount);

    games[code] = {
      code,
      hostSessionId: config.sessionId,
      config,
      questions: generatedQuestions,
      players: {}, // sessionId -> player data
      state: 'lobby', // 'lobby' | 'question' | 'podium'
      currentQ: 0,
      timeLeft: config.timerMode,
      timerInterval: null,
      bonusRound: false,
      bonusUsed: false,
      firstBloodQ: false
    };

    socket.join(code);
    socketMap[socket.id] = { code, sessionId: config.sessionId };
    
    callback({ success: true, code, questions: generatedQuestions });
  });

  socket.on('join_game', ({ code, player, sessionId }, callback) => {
    const game = games[code];
    if (!game) {
      return callback({ success: false, message: 'Game not found' });
    }
    if (game.state !== 'lobby') {
      return callback({ success: false, message: 'Game already in progress' });
    }

    game.players[sessionId] = {
      ...player,
      sessionId,
      socketId: socket.id,
      score: 0,
      streak: 0,
      answered: false,
      chosenAnswer: -1,
      connected: true
    };

    socket.join(code);
    socketMap[socket.id] = { code, sessionId };
    
    io.to(code).emit('lobby_update', Object.values(game.players));
    
    callback({ success: true, questions: game.questions, config: game.config });
  });

  socket.on('rejoin_game', ({ code, sessionId }, callback) => {
    const game = games[code];
    if (!game || !game.players[sessionId]) {
      return callback({ success: false });
    }

    // Reconnect player
    game.players[sessionId].socketId = socket.id;
    game.players[sessionId].connected = true;
    socket.join(code);
    socketMap[socket.id] = { code, sessionId };

    io.to(code).emit('lobby_update', Object.values(game.players));

    // Return the exact current state
    const currentQuestionData = game.state === 'question' ? { ...game.questions[game.currentQ] } : null;
    if (currentQuestionData) delete currentQuestionData.answer;

    callback({ 
      success: true, 
      state: game.state, 
      questions: game.questions, 
      config: game.config,
      currentQ: game.currentQ,
      timeLeft: game.timeLeft,
      bonusRound: game.bonusRound,
      questionData: currentQuestionData,
      players: Object.values(game.players)
    });
  });

  socket.on('update_player', ({ code, player, sessionId }) => {
    const game = games[code];
    if (game && game.players[sessionId]) {
      game.players[sessionId] = { ...game.players[sessionId], ...player };
      io.to(code).emit('lobby_update', Object.values(game.players));
    }
  });

  socket.on('start_game', ({ code, sessionId }) => {
    const game = games[code];
    if (!game || game.hostSessionId !== sessionId) return;
    
    game.currentQ = 0;
    game.bonusUsed = false;
    startGameLoop(code);
  });

  socket.on('cancel_game', ({ code, sessionId }) => {
    const game = games[code];
    if (!game || game.hostSessionId !== sessionId) return;

    clearInterval(game.timerInterval);
    io.to(code).emit('game_cancelled');
    delete games[code];
  });

  socket.on('kick_player', ({ code, sessionId, targetSessionId }) => {
    const game = games[code];
    if (!game || game.hostSessionId !== sessionId) return;
    if (!game.players[targetSessionId]) return;

    const targetSocketId = game.players[targetSessionId].socketId;
    delete game.players[targetSessionId];
    
    io.to(targetSocketId).emit('kicked');
    io.to(code).emit('lobby_update', Object.values(game.players));
  });

  const startGameLoop = (code) => {
    const game = games[code];
    if (!game) return;

    if (game.currentQ >= game.questions.length) {
      game.state = 'podium';
      io.to(code).emit('game_over', Object.values(game.players));
      return;
    }

    game.state = 'question';
    game.timeLeft = game.config.timerMode;
    game.firstBloodQ = false;
    
    // Reset player answer states
    Object.values(game.players).forEach(p => {
      p.answered = false;
      p.chosenAnswer = -1;
    });

    let isBonus = false;
    if (!game.bonusUsed && Math.random() < 0.25) {
      isBonus = true;
      game.bonusUsed = true;
    }
    game.bonusRound = isBonus;

    const currentQuestionData = { ...game.questions[game.currentQ] };
    delete currentQuestionData.answer;

    io.to(code).emit('question_start', {
      qIndex: game.currentQ,
      bonusRound: isBonus,
      question: currentQuestionData,
      timeLeft: game.timeLeft,
      players: Object.values(game.players)
    });

    clearInterval(game.timerInterval);
    game.timerInterval = setInterval(() => {
      game.timeLeft -= 1;
      
      if (game.timeLeft <= 0) {
        clearInterval(game.timerInterval);
        resolveQuestion(code);
      }
    }, 1000);
  };

  socket.on('submit_answer', ({ code, sessionId, answerIndex }) => {
    const game = games[code];
    if (!game || game.state !== 'question') return;
    
    const player = game.players[sessionId];
    if (!player || player.answered) return;

    player.answered = true;
    player.chosenAnswer = answerIndex;

    const correctIndex = game.questions[game.currentQ].answer;
    const isCorrect = answerIndex === correctIndex;

    if (isCorrect) {
      let pts = 100;
      if (game.timeLeft >= 11) pts += 50;
      else if (game.timeLeft >= 6) pts += 25;
      
      if (!game.firstBloodQ) {
        pts += 20;
        game.firstBloodQ = true;
      }

      if (game.bonusRound) pts *= 2;
      pts = Math.round(pts * getStreakMult(player.streak));
      
      player.score += pts;
      player.streak += 1;
    } else {
      player.streak = 0;
    }

    // Check if all connected players have answered
    const activePlayers = Object.values(game.players).filter(p => p.connected);
    const allAnswered = activePlayers.every(p => p.answered);
    
    if (activePlayers.length > 0 && allAnswered) {
      clearInterval(game.timerInterval);
      resolveQuestion(code);
    }
  });

  const resolveQuestion = (code) => {
    const game = games[code];
    if (!game) return;
    
    const correctIndex = game.questions[game.currentQ].answer;

    io.to(code).emit('question_result', {
      correctAnswer: correctIndex,
      players: Object.values(game.players)
    });

    setTimeout(() => {
      game.currentQ += 1;
      startGameLoop(code);
    }, 3000);
  };

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    const mapping = socketMap[socket.id];
    if (mapping) {
      const { code, sessionId } = mapping;
      const game = games[code];
      
      if (game && game.players[sessionId]) {
        game.players[sessionId].connected = false;
        io.to(code).emit('lobby_update', Object.values(game.players));
        
        // Re-evaluate if timer can be skipped for remaining players
        if (game.state === 'question') {
           const activePlayers = Object.values(game.players).filter(p => p.connected);
           if (activePlayers.length > 0 && activePlayers.every(p => p.answered)) {
             clearInterval(game.timerInterval);
             resolveQuestion(code);
           }
        }
      }
      delete socketMap[socket.id];
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Authoritative Game Server running on port ${PORT}`);
});
