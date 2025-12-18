
import React, { useState } from 'react';

interface Props {
  nickname: string;
  onNicknameChange: (name: string) => void;
  onCreate: () => void;
  onJoin: (code: string) => void;
  onRejoin?: () => void;
  lastRoomCode?: string | null;
  isLoading: boolean;
  error: string | null;
}

const JoinScreen: React.FC<Props> = ({ nickname, onNicknameChange, onCreate, onJoin, onRejoin, lastRoomCode, isLoading, error }) => {
  const [code, setCode] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-800">Imposter Game</h1>
        <p className="text-sm text-slate-500 font-medium">Find the imposter among you</p>
      </div>

      {/* Identity Card */}
      <div className="bg-slate-800 rounded-2xl p-5 flex flex-col items-center">
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Playing As</span>
        {isEditingName ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <input
              type="text"
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value.slice(0, 20))}
              className="text-xl font-bold text-center bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
              placeholder="Enter nickname"
              autoFocus
            />
            <button
              onClick={() => setIsEditingName(false)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{nickname}</span>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-slate-400 hover:text-white transition-colors"
              title="Edit nickname"
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {lastRoomCode && onRejoin && (
          <button
            onClick={onRejoin}
            disabled={isLoading}
            className="w-full py-4 bg-amber-600 text-white rounded-xl font-bold tracking-wide active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>↻</span>
            {isLoading ? 'Rejoining...' : `Rejoin Room ${lastRoomCode}`}
          </button>
        )}
        
        <button
          onClick={onCreate}
          disabled={isLoading}
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold tracking-wide active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create New Room'}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-slate-100"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-slate-400 uppercase tracking-widest text-xs font-bold">or join</span>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="ENTER CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
            className="w-full px-5 py-4 bg-slate-100 border-2 border-slate-200 rounded-xl text-center text-2xl font-mono font-bold tracking-[0.5em] focus:border-slate-400 focus:outline-none transition-all"
          />
          <button
            onClick={() => code.length === 4 && onJoin(code)}
            disabled={isLoading || code.length !== 4}
            className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold tracking-wide active:scale-[0.98] transition-all disabled:opacity-30"
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-center text-sm text-red-600 font-bold bg-red-50 py-3 rounded-xl border-2 border-red-100">
          {error}
        </p>
      )}
    </div>
  );
};

export default JoinScreen;
