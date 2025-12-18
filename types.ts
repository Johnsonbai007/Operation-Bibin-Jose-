
export enum MessageType {
  JOIN = 'JOIN',
  PLAYER_LIST = 'PLAYER_LIST',
  GAME_START = 'GAME_START',
  VOTE_PHASE = 'VOTE_PHASE',
  CAST_VOTE = 'CAST_VOTE',
  GAME_OVER = 'GAME_OVER',
  RESET_LOBBY = 'RESET_LOBBY',
  CHAT = 'CHAT'
}

export interface Player {
  id: string;
  nickname: string;
  isHost: boolean;
}

export interface GameSettings {
  theme: string;
  imposterCount: number;
}

export interface GameStartPayload {
  role: 'CITIZEN' | 'IMPOSTER';
  word: string;
  startingPlayerNickname: string;
  theme: string;
  players: Player[]; // Include players for voting list
}

export interface GameOverPayload {
  winner: 'CITIZENS' | 'IMPOSTERS';
  imposters: string[]; // Nicknames
  secretWord: string;
}

export interface PeerMessage {
  type: MessageType;
  payload: any;
}

export type ConnectionState = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
