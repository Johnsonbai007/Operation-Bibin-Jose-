
import { COLORS, ANIMALS } from '../constants';

const STORAGE_KEY = 'p2p_nickname';

export const getRandomNickname = (): string => {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${color} ${animal}`;
};

export const getOrSetNickname = (): string => {
  let nickname = localStorage.getItem(STORAGE_KEY);
  if (!nickname) {
    nickname = getRandomNickname();
    localStorage.setItem(STORAGE_KEY, nickname);
  }
  return nickname;
};

export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
