
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { getOrSetNickname, generateRoomCode } from './utils/identity';
import { MessageType, Player, PeerMessage, ConnectionState, GameStartPayload, GameSettings, GameOverPayload } from './types';
import { WORD_DATABASE, THEMES, ThemeName } from './constants';
import Lobby from './components/Lobby';
import JoinScreen from './components/JoinScreen';
import GameView from './components/GameView';

const App: React.FC = () => {
  const [nickname, setNickname] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<'SETUP' | 'LOBBY' | 'GAME'>('SETUP');
  const [gamePhase, setGamePhase] = useState<'REVEAL' | 'VOTING' | 'RESULT'>('REVEAL');
  const [connState, setConnState] = useState<ConnectionState>('IDLE');
  const [error, setError] = useState<string | null>(null);
  
  const [myGameData, setMyGameData] = useState<GameStartPayload | null>(null);
  const [gameOverData, setGameOverData] = useState<GameOverPayload | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({}); // Tally for host
  const [hasVoted, setHasVoted] = useState(false);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const currentImposterIds = useRef<Set<string>>(new Set());
  const currentWord = useRef<string>("");

  useEffect(() => {
    setNickname(getOrSetNickname());
  }, []);

  const broadcast = useCallback((msg: PeerMessage) => {
    connectionsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send(msg);
      } else {
        conn.once('open', () => conn.send(msg));
      }
    });
  }, []);

  const handleMessage = useCallback((msg: PeerMessage, senderId: string) => {
    switch (msg.type) {
      case MessageType.JOIN:
        const newPlayer: Player = {
          id: senderId,
          nickname: msg.payload.nickname,
          isHost: false
        };
        
        setPlayers(prev => {
          if (prev.find(p => p.id === senderId)) return prev;
          const updated = [...prev, newPlayer];
          broadcast({ type: MessageType.PLAYER_LIST, payload: updated });
          return updated;
        });
        break;

      case MessageType.PLAYER_LIST:
        setPlayers(msg.payload);
        break;

      case MessageType.GAME_START:
        setMyGameData(msg.payload);
        setGameState('GAME');
        setGamePhase('REVEAL');
        setHasVoted(false);
        setGameOverData(null);
        break;

      case MessageType.VOTE_PHASE:
        setGamePhase('VOTING');
        break;

      case MessageType.CAST_VOTE:
        if (isHost) {
          const votedPlayerId = msg.payload.votedId;
          setVotes(prev => ({
            ...prev,
            [votedPlayerId]: (prev[votedPlayerId] || 0) + 1
          }));
        }
        break;

      case MessageType.GAME_OVER:
        setGameOverData(msg.payload);
        setGamePhase('RESULT');
        break;

      case MessageType.RESET_LOBBY:
        setGameState('LOBBY');
        setMyGameData(null);
        setGameOverData(null);
        setVotes({});
        setHasVoted(false);
        break;

      default:
        console.warn('Unknown message type:', msg.type);
    }
  }, [broadcast, isHost]);

  const setupHost = (code: string) => {
    const peer = new Peer(code);
    peerRef.current = peer;
    setConnState('CONNECTING');

    peer.on('open', (id) => {
      setRoomCode(id);
      setIsHost(true);
      setPlayers([{ id, nickname, isHost: true }]);
      setGameState('LOBBY');
      setConnState('CONNECTED');
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        connectionsRef.current.set(conn.peer, conn);
      });
      conn.on('data', (data) => handleMessage(data as PeerMessage, conn.peer));
      conn.on('close', () => {
        connectionsRef.current.delete(conn.peer);
        setPlayers(prev => {
          const updated = prev.filter(p => p.id !== conn.peer);
          broadcast({ type: MessageType.PLAYER_LIST, payload: updated });
          return updated;
        });
      });
    });

    peer.on('error', (err) => {
      if (err.type === 'unavailable-id') setError('Room code is already in use.');
      else setError('Connection error.');
      setConnState('ERROR');
    });
  };

  const joinRoom = (code: string) => {
    const peer = new Peer();
    peerRef.current = peer;
    setConnState('CONNECTING');

    peer.on('open', (myId) => {
      const conn = peer.connect(code, { reliable: true });
      conn.on('open', () => {
        connectionsRef.current.set(code, conn);
        setIsHost(false);
        setRoomCode(code);
        setGameState('LOBBY');
        setConnState('CONNECTED');
        conn.send({ type: MessageType.JOIN, payload: { nickname } });
      });
      conn.on('data', (data) => handleMessage(data as PeerMessage, code));
      conn.on('close', () => {
        setGameState('SETUP');
        setError('Disconnected from host.');
      });
    });

    peer.on('error', () => {
      setError('Connection failed.');
      setConnState('ERROR');
    });
  };

  const startGame = (settings: GameSettings) => {
    if (!isHost || players.length < 3) return;

    const themeWords = WORD_DATABASE[settings.theme as ThemeName];
    const word = themeWords[Math.floor(Math.random() * themeWords.length)];
    currentWord.current = word;

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const imposterCount = Math.min(settings.imposterCount, players.length - 1);
    const imposterIds = new Set(shuffledPlayers.slice(0, imposterCount).map(p => p.id));
    currentImposterIds.current = imposterIds;
    
    const validStartingPlayers = shuffledPlayers.slice(imposterCount);
    const startingPlayer = validStartingPlayers[Math.floor(Math.random() * validStartingPlayers.length)];

    setVotes({});
    players.forEach(p => {
      const isImposter = imposterIds.has(p.id);
      const payload: GameStartPayload = {
        role: isImposter ? 'IMPOSTER' : 'CITIZEN',
        word: isImposter ? '???' : word,
        startingPlayerNickname: startingPlayer.nickname,
        theme: settings.theme,
        players: players // Needed for voting
      };

      if (p.id === peerRef.current?.id) {
        setMyGameData(payload);
        setGameState('GAME');
        setGamePhase('REVEAL');
        setHasVoted(false);
      } else {
        const conn = connectionsRef.current.get(p.id);
        if (conn && conn.open) {
          conn.send({ type: MessageType.GAME_START, payload });
        }
      }
    });
  };

  const initiateVote = () => {
    if (!isHost) return;
    setVotes({});
    broadcast({ type: MessageType.VOTE_PHASE, payload: {} });
    setGamePhase('VOTING');
  };

  const castVote = (votedId: string) => {
    setHasVoted(true);
    if (isHost) {
      setVotes(prev => ({
        ...prev,
        [votedId]: (prev[votedId] || 0) + 1
      }));
    } else {
      const conn = connectionsRef.current.get(roomCode!);
      if (conn) {
        conn.send({ type: MessageType.CAST_VOTE, payload: { votedId } });
      }
    }
  };

  const finalizeVote = (votedId: string) => {
    if (!isHost) return;
    const isCorrect = currentImposterIds.current.has(votedId);
    
    if (isCorrect) {
      // Civilians win
      const imposters = players.filter(p => currentImposterIds.current.has(p.id)).map(p => p.nickname);
      const payload: GameOverPayload = {
        winner: 'CITIZENS',
        imposters,
        secretWord: currentWord.current
      };
      setGameOverData(payload);
      setGamePhase('RESULT');
      broadcast({ type: MessageType.GAME_OVER, payload });
    } else {
      // Wrong guess - restart round with new speaker but same word
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      const validStartingPlayers = shuffled.filter(p => !currentImposterIds.current.has(p.id));
      const startingPlayer = validStartingPlayers[Math.floor(Math.random() * validStartingPlayers.length)];

      players.forEach(p => {
        const isImposter = currentImposterIds.current.has(p.id);
        const payload: GameStartPayload = {
          role: isImposter ? 'IMPOSTER' : 'CITIZEN',
          word: isImposter ? '???' : currentWord.current,
          startingPlayerNickname: startingPlayer.nickname,
          theme: myGameData!.theme,
          players: players
        };

        if (p.id === peerRef.current?.id) {
          setMyGameData(payload);
          setGamePhase('REVEAL');
          setHasVoted(false);
        } else {
          const conn = connectionsRef.current.get(p.id);
          if (conn && conn.open) {
            conn.send({ type: MessageType.GAME_START, payload });
          }
        }
      });
    }
  };

  const backToLobby = () => {
    if (!isHost) return;
    setGameState('LOBBY');
    setMyGameData(null);
    setGameOverData(null);
    setVotes({});
    setHasVoted(false);
    broadcast({ type: MessageType.RESET_LOBBY, payload: {} });
  };

  const reset = () => {
    if (peerRef.current) peerRef.current.destroy();
    connectionsRef.current.clear();
    setPlayers([]);
    setGameState('SETUP');
    setConnState('IDLE');
    setError(null);
    setMyGameData(null);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col items-center justify-center p-6 sm:p-8">
      {gameState === 'SETUP' && (
        <JoinScreen 
          nickname={nickname}
          onCreate={() => setupHost(generateRoomCode())} 
          onJoin={joinRoom} 
          isLoading={connState === 'CONNECTING'}
          error={error}
        />
      )}

      {gameState === 'LOBBY' && roomCode && (
        <Lobby 
          roomCode={roomCode} 
          players={players} 
          isHost={isHost} 
          onStart={startGame} 
          onLeave={reset}
        />
      )}

      {gameState === 'GAME' && myGameData && (
        <GameView 
          gameData={myGameData} 
          gameOverData={gameOverData}
          phase={gamePhase}
          isHost={isHost}
          hasVoted={hasVoted}
          votes={votes}
          onInitiateVote={initiateVote}
          onCastVote={castVote}
          onFinalizeVote={finalizeVote}
          onBackToLobby={backToLobby}
          onEnd={reset} 
        />
      )}
    </div>
  );
};

export default App;
