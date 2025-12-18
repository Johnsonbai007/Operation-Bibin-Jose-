
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
    <div className="w-full h-full flex flex-col space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Room Code</span>
        <div className="text-5xl font-mono font-bold tracking-widest text-gray-900 select-all cursor-pointer">
          {roomCode}
        </div>
      </div>

      {isHost && (
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                    selectedTheme === theme 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Imposters</label>
            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              {[1, 2].map(count => (
                <button
                  key={count}
                  onClick={() => setImposterCount(count)}
                  disabled={players.length <= count + 1}
                  className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                    imposterCount === count 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-400'
                  } disabled:opacity-20`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Players ({players.length})
          </h2>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded uppercase font-bold">
            Live
          </span>
        </div>
        
        <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
          {players.map((player) => (
            <div 
              key={player.id}
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${player.isHost ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                <span className="text-sm font-medium text-gray-800">{player.nickname}</span>
              </div>
              {player.isHost && (
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-widest border border-amber-100">Host</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        {isHost ? (
          <button
            onClick={() => onStart({ theme: selectedTheme, imposterCount })}
            disabled={!canStart}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium tracking-wide shadow-xl active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            Start Game
          </button>
        ) : (
          <div className="text-center py-4 text-xs text-gray-400 font-medium italic animate-pulse">
            Host is choosing settings...
          </div>
        )}
        <button
          onClick={onLeave}
          className="w-full py-2 text-gray-400 rounded-xl font-medium text-[10px] tracking-widest uppercase hover:text-gray-900 transition-all"
        >
          Exit Room
        </button>
      </div>
    </div>
  );
};

export default Lobby;
