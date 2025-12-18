
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStartPayload, GameOverPayload, Player } from '../types';

interface Props {
  gameData: GameStartPayload;
  gameOverData: GameOverPayload | null;
  phase: 'REVEAL' | 'VOTING' | 'RESULT';
  isHost: boolean;
  hasVoted: boolean;
  votes: Record<string, number>;
  votesReceived: number;
  totalPlayers: number;
  onInitiateVote: () => void;
  onCastVote: (id: string) => void;
  onFinalizeVote: (id: string) => void;
  onBackToLobby: () => void;
  onEnd: () => void;
}

const GameView: React.FC<Props> = ({ 
  gameData, 
  gameOverData, 
  phase, 
  isHost, 
  hasVoted, 
  votes,
  votesReceived,
  totalPlayers,
  onInitiateVote, 
  onCastVote, 
  onFinalizeVote,
  onBackToLobby,
  onEnd 
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isImposter = gameData.role === 'IMPOSTER';
  
  // Get current player's info from the players list
  const currentPlayer = gameData.players.find(p => p.id === localStorage.getItem('myPlayerId'));
  const myNickname = currentPlayer?.nickname || 'You';
  const myEmoji = currentPlayer?.emoji || '👤';

  const mostVoted = useMemo(() => {
    let max = -1;
    let winnerId = "";
    (Object.entries(votes) as [string, number][]).forEach(([id, count]) => {
      if (count > max) {
        max = count;
        winnerId = id;
      }
    });
    return winnerId;
  }, [votes]);

  const allVotesIn = votesReceived >= totalPlayers;

  return (
    <div className="w-full min-h-full flex flex-col items-center py-4 space-y-6 animate-fadeIn overflow-y-auto">
      
      {phase === 'REVEAL' && (
        <>
          {/* Header Info */}
          <div className="text-center py-3 px-6 bg-slate-100 rounded-xl">
            <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase block">Theme</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">{gameData.theme}</h2>
          </div>

          {/* Card Container */}
          <div className="relative w-full max-w-[280px] aspect-[3/4] perspective-1000">
            <motion.div
              className="w-full h-full relative preserve-3d cursor-pointer"
              initial={false}
              animate={{ rotateY: isRevealed ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => !isRevealed && setIsRevealed(true)}
            >
              {/* Card Back (Face Down) */}
              <div className="absolute inset-0 backface-hidden bg-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 border-4 border-slate-700">
                <div className="w-20 h-20 mb-8 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">❓</span>
                  </div>
                </div>
                <p className="text-amber-500 text-[11px] font-bold tracking-[0.4em] uppercase mb-3">Secret Card</p>
                <p className="text-white text-lg font-semibold">Tap to Reveal</p>
              </div>

              {/* Card Front (Face Up) */}
              <div className={`absolute inset-0 backface-hidden rounded-3xl flex flex-col items-center justify-center p-8 border-4 [transform:rotateY(180deg)] ${
                isImposter ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
              }`}>
                {/* Player Info */}
                <div className="mb-4 flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full">
                  <span className="text-2xl">{myEmoji}</span>
                  <span className="text-sm font-bold text-slate-700">{myNickname}</span>
                </div>

                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${isImposter ? 'bg-red-100' : 'bg-emerald-100'}`}>
                  <span className="text-4xl">{isImposter ? '🕵️' : '👤'}</span>
                </div>
                
                <span className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Your Role</span>
                <h3 className={`text-3xl font-black mb-6 ${isImposter ? 'text-red-600' : 'text-emerald-600'}`}>
                  {isImposter ? 'IMPOSTER' : 'CITIZEN'}
                </h3>

                {!isImposter ? (
                  <div className="text-center bg-white py-4 px-6 rounded-xl border-2 border-emerald-100">
                    <span className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">Secret Word</span>
                    <p className="text-3xl font-bold text-slate-800">{gameData.word}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-400 text-center font-medium px-4">
                    Blend in and don't get caught!
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="w-full space-y-5 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isRevealed ? (
                <motion.button
                  key="hide-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRevealed(false)}
                  className="px-8 py-3 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest"
                >
                  Hide Role
                </motion.button>
              ) : (
                <div key="spacer" className="h-[42px]" />
              )}
            </AnimatePresence>

            <div className="text-center bg-amber-50 py-3 px-6 rounded-xl border-2 border-amber-100">
              <span className="text-[10px] font-bold tracking-[0.2em] text-amber-600 uppercase block">Starts Speaking</span>
              <span className="text-lg font-bold text-slate-800">{gameData.startingPlayerNickname}</span>
            </div>

            {isHost && (
              <button
                onClick={onInitiateVote}
                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold tracking-wide active:scale-[0.98] transition-all"
              >
                Start Voting
              </button>
            )}
          </div>
        </>
      )}

      {phase === 'VOTING' && (
        <div className="w-full space-y-6 flex flex-col items-center animate-fadeIn pb-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-800">Vote Now</h2>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Who is the Imposter?</p>
            <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mt-2">
              <span className="text-sm font-bold text-slate-600">
                {votesReceived} / {totalPlayers} voted
              </span>
              {allVotesIn && <span className="text-emerald-500 text-lg">✓</span>}
            </div>
          </div>

          <div className="w-full space-y-2 px-2">
            {gameData.players.map(p => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.98 }}
                disabled={hasVoted}
                onClick={() => onCastVote(p.id)}
                className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${
                  hasVoted 
                    ? (mostVoted === p.id 
                        ? 'bg-amber-50 border-amber-300' 
                        : 'bg-slate-50 border-slate-100 opacity-50') 
                    : 'bg-white border-slate-200 hover:border-slate-400 active:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="font-semibold text-slate-800">{p.nickname}</span>
                </div>
                {isHost && votes[p.id] !== undefined && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                    {votes[p.id]} {votes[p.id] === 1 ? 'vote' : 'votes'}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          <div className="text-center w-full px-4">
            {hasVoted ? (
              <p className="text-sm text-slate-400 font-medium py-4">
                {allVotesIn ? 'All votes in! Revealing result...' : 'Waiting for other players...'}
              </p>
            ) : (
              <p className="text-sm text-slate-400 font-medium py-4">
                Select who you think is the imposter
              </p>
            )}
          </div>
        </div>
      )}

      {phase === 'RESULT' && gameOverData && (
        <div className="w-full flex flex-col items-center space-y-8 animate-fadeIn text-center px-4 pb-4">
          <div className={`p-6 rounded-full ${gameOverData.winner === 'CITIZENS' ? 'bg-emerald-100' : 'bg-red-100'}`}>
            <span className="text-6xl">{gameOverData.winner === 'CITIZENS' ? '🎉' : '💀'}</span>
          </div>
          
          <div className="space-y-2">
            <h2 className={`text-4xl font-black ${gameOverData.winner === 'CITIZENS' ? 'text-emerald-600' : 'text-red-600'}`}>
              {gameOverData.winner === 'CITIZENS' ? 'Citizens Win!' : 'Imposters Win!'}
            </h2>
            <p className="text-slate-500 font-medium">The imposter has been revealed.</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 w-full space-y-4">
            <div className="flex justify-between items-center pb-3 border-b-2 border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Secret Word</span>
              <span className="text-xl font-bold text-slate-800">{gameOverData.secretWord}</span>
            </div>
            <div className="space-y-2 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Imposters</span>
              <div className="flex flex-wrap gap-2">
                {gameOverData.imposters.map(n => (
                  <span key={n} className="px-4 py-2 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {isHost && (
            <button
              onClick={onBackToLobby}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold tracking-wide active:scale-[0.98] transition-all"
            >
              Back to Lobby
            </button>
          )}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onEnd}
        className="text-slate-300 hover:text-red-500 text-xs font-bold tracking-[0.2em] uppercase transition-colors pt-2 pb-2"
      >
        Quit Game
      </motion.button>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default GameView;
