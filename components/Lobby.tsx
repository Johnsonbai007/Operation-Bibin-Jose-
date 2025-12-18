
import React, { useState } from 'react';
import { Player, GameSettings } from '../types';
import { THEMES } from '../constants';

interface Props {
  roomCode: string;
  players: Player[];
  isHost: boolean;
  onStart: (settings: GameSettings) => void;
  onLeave: () => void;
}

const Lobby: React.FC<Props> = ({ roomCode, players, isHost, onStart, onLeave }) => {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [imposterCount, setImposterCount] = useState(1);
  const canStart = players.length >= 3;

  return (
    <div className="w-full min-h-full flex flex-col space-y-5 animate-fadeIn pb-4">
      {/* Room Code Header */}
      <div className="text-center py-4 bg-slate-900 rounded-2xl">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">Room Code</span>
        <div className="text-4xl font-mono font-bold tracking-[0.3em] text-white select-all cursor-pointer">
          {roomCode}
        </div>
      </div>

      {/* Host Settings */}
      {isHost && (
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border-2 ${
                    selectedTheme === theme 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Imposters</label>
            <div className="flex bg-white rounded-xl p-1 border-2 border-slate-200">
              {[1, 2].map(count => (
                <button
                  key={count}
                  onClick={() => setImposterCount(count)}
                  disabled={players.length <= count + 1}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    imposterCount === count 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-400 hover:text-slate-600'
                  } disabled:opacity-20`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Players List */}
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Players ({players.length})
          </h2>
          <span className="text-[10px] bg-emerald-500 text-white px-2.5 py-1 rounded-full uppercase font-bold">
            ● Live
          </span>
        </div>
        
        <div className="space-y-2 max-h-[35vh] overflow-y-auto">
          {players.map((player) => (
            <div 
              key={player.id}
              className="flex items-center justify-between p-3.5 bg-white rounded-xl border-2 border-slate-100"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{player.emoji}</span>
                <span className="text-sm font-semibold text-slate-800">{player.nickname}</span>
              </div>
              {player.isHost && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-3 border-t-2 border-slate-100">
        {isHost ? (
          <button
            onClick={() => onStart({ theme: selectedTheme, imposterCount })}
            disabled={!canStart}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm tracking-wide active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:text-slate-400"
          >
            {canStart ? 'Start Game' : `Need ${3 - players.length} more player(s)`}
          </button>
        ) : (
          <div className="text-center py-4 text-sm text-slate-400 font-medium">
            Waiting for host to start the game...
          </div>
        )}
        <button
          onClick={onLeave}
          className="w-full py-3 text-slate-400 rounded-xl font-bold text-xs tracking-widest uppercase hover:text-red-500 transition-all"
        >
          Exit Room
        </button>
      </div>
    </div>
  );
};

export default Lobby;
