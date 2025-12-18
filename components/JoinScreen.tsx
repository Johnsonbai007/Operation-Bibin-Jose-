
import React, { useState } from 'react';

interface Props {
  nickname: string;
  onCreate: () => void;
  onJoin: (code: string) => void;
  isLoading: boolean;
  error: string | null;
}

const JoinScreen: React.FC<Props> = ({ nickname, onCreate, onJoin, isLoading, error }) => {
  const [code, setCode] = useState('');

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">Classy Lobby</h1>
        <p className="text-sm text-gray-500 font-medium">minimalist P2P networking</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center">
        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Your Identity</span>
        <span className="text-xl font-medium text-gray-800 italic">"{nickname}"</span>
      </div>

      <div className="space-y-4">
        <button
          onClick={onCreate}
          disabled={isLoading}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium tracking-wide shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create New Room'}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 uppercase tracking-widest text-xs font-bold">or join one</span>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="ENTER 4-DIGIT CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
            className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-gray-200 transition-all outline-none"
          />
          <button
            onClick={() => code.length === 4 && onJoin(code)}
            disabled={isLoading || code.length !== 4}
            className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-medium tracking-wide active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-center text-sm text-red-500 font-medium bg-red-50 py-3 rounded-lg border border-red-100">
          {error}
        </p>
      )}
    </div>
  );
};

export default JoinScreen;
