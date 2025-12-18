
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

  // Fix: Explicitly cast Object.entries(votes) to [string, number][] to avoid 'unknown' type errors during comparison
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-4 space-y-6 animate-fadeIn overflow-y-auto">
      
      {phase === 'REVEAL' && (
        <>
          {/* Header Info */}
          <div className="text-center space-y-1">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase block"
            >
              Active Theme
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-light tracking-tight text-gray-900"
            >
              {gameData.theme}
            </motion.h2>
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
              <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8 border border-white/10">
                <div className="w-20 h-20 mb-8 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-12 h-12 border-2 border-amber-500/30 rounded-full flex items-center justify-center">
                     <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                  </div>
                </div>
                <p className="text-amber-500/70 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Secret Data</p>
                <p className="text-white text-base font-light tracking-wide opacity-80">Tap to Reveal</p>
              </div>

              {/* Card Front (Face Up) */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-8 border border-gray-100 [transform:rotateY(180deg)]">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isImposter ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                   {isImposter ? (
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                   ) : (
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   )}
                </div>
                
                <span className="text-gray-400 text-[9px] font-bold tracking-[0.3em] uppercase mb-1">Assigned Role</span>
                <h3 className={`text-2xl font-bold mb-8 tracking-tight ${isImposter ? 'text-red-500' : 'text-emerald-600'}`}>
                  {isImposter ? 'IMPOSTER' : 'CITIZEN'}
                </h3>

                {!isImposter ? (
                  <div className="text-center space-y-1">
                    <span className="text-gray-400 text-[9px] font-bold tracking-[0.2em] uppercase">Secret Word</span>
                    <p className="text-3xl font-semibold text-gray-900 tracking-tight">{gameData.word}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center leading-relaxed italic px-4">
                    "Blend in. Do not let the others suspect your true identity."
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="w-full space-y-6 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isRevealed ? (
                <motion.button
                  key="hide-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRevealed(false)}
                  className="px-8 py-3 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200"
                >
                  Hide Role
                </motion.button>
              ) : (
                <div key="spacer" className="h-[42px]" />
              )}
            </AnimatePresence>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase block">Round Start</span>
              <div className="flex items-center space-x-2 text-gray-900">
                <span className="text-xs font-medium text-gray-400">Speaker:</span>
                <span className="text-lg font-medium italic border-b border-amber-200">
                  {gameData.startingPlayerNickname}
                </span>
              </div>
            </div>

            {isHost && (
              <button
                onClick={onInitiateVote}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium tracking-wide shadow-xl active:scale-95 transition-all"
              >
                Initiate Voting
              </button>
            )}
          </div>
        </>
      )}

      {phase === 'VOTING' && (
        <div className="w-full flex-1 space-y-8 flex flex-col items-center justify-center animate-fadeIn">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-light text-gray-900">Cast Your Vote</h2>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Identify the Imposter</p>
            {isHost && (
              <p className="text-xs text-gray-400 mt-2">
                Votes received: {votesReceived} / {totalPlayers}
              </p>
            )}
          </div>

          <div className="w-full grid grid-cols-1 gap-3 px-4">
            {gameData.players.map(p => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.98 }}
                disabled={hasVoted}
                onClick={() => onCastVote(p.id)}
                className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                  hasVoted ? (mostVoted === p.id ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-transparent opacity-50') 
                  : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'
                }`}
              >
                <span className="font-medium text-gray-800">{p.nickname}</span>
                {isHost && votes[p.id] !== undefined && (
                  <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full">
                    {votes[p.id]} {votes[p.id] === 1 ? 'vote' : 'votes'}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          <div className="text-center w-full px-8">
            {isHost ? (
              <button
                disabled={Object.keys(votes).length === 0}
                onClick={() => onFinalizeVote(mostVoted)}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium tracking-wide disabled:opacity-20"
              >
                Reveal Voted Player
              </button>
            ) : (
              <p className="text-sm text-gray-400 italic">
                {hasVoted ? 'Wait for host to reveal result...' : 'Select a suspect above'}
              </p>
            )}
          </div>
        </div>
      )}

      {phase === 'RESULT' && gameOverData && (
        <div className="w-full flex-1 flex flex-col items-center justify-center space-y-10 animate-fadeIn text-center px-4">
          <div className="space-y-4">
            <div className={`p-10 rounded-full inline-block ${gameOverData.winner === 'CITIZENS' ? 'bg-emerald-50' : 'bg-red-50'}`}>
               <svg className={`w-16 h-16 ${gameOverData.winner === 'CITIZENS' ? 'text-emerald-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                {gameOverData.winner === 'CITIZENS' ? 'Civilians Win!' : 'Imposters Win!'}
              </h2>
              <p className="text-gray-500">The imposter was revealed.</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 w-full space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secret Word</span>
              <span className="text-lg font-medium text-gray-900">{gameOverData.secretWord}</span>
            </div>
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Imposters</span>
              <div className="flex flex-wrap gap-2">
                {gameOverData.imposters.map(n => (
                  <span key={n} className="px-3 py-1 bg-white border border-red-100 text-red-500 text-xs font-medium rounded-full">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {isHost && (
            <button
              onClick={onBackToLobby}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium tracking-wide shadow-xl active:scale-95 transition-all"
            >
              Back to Lobby
            </button>
          )}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onEnd}
        className="text-gray-300 hover:text-red-400 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors pt-4 pb-2"
      >
        Quit Session
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
