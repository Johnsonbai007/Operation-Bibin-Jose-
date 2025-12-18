
export const COLORS = [
  'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Amber', 'Violet', 'Cyan',
  'Indigo', 'Coral', 'Teal', 'Onyx', 'Pearl', 'Sage', 'Ruby', 'Sapphire'
];

export const ANIMALS = [
  'Heron', 'Falcon', 'Lynx', 'Panda', 'Otter', 'Badger', 'Wolf', 'Eagle',
  'Dolphin', 'Tiger', 'Fox', 'Raven', 'Bear', 'Owl', 'Stag', 'Cobra'
];

// Unique player emojis - each player gets assigned one based on join order
export const PLAYER_EMOJIS = [
  '🦊', '🐼', '🦁', '🐯', '🐺', '🦅', '🦉', '🐙',
  '🦋', '🐬', '🦈', '🐢', '🦩', '🦚', '🐍', '🦎'
];

// Get emoji for a player based on their index
export const getPlayerEmoji = (index: number): string => {
  return PLAYER_EMOJIS[index % PLAYER_EMOJIS.length];
};

export const WORD_DATABASE = {
  Nature: [
    'Waterfall', 'Mountain', 'Volcano', 'Glacier', 'Forest', 'Desert', 'Canyon', 'Ocean', 'Cave', 'Island'
  ],
  Food: [
    'Pizza', 'Sushi', 'Burger', 'Taco', 'Pasta', 'Steak', 'Salad', 'Ramen', 'Burrito', 'Waffle'
  ],
  Travel: [
    'Passport', 'Suitcase', 'Airplane', 'Train', 'Backpack', 'Hotel', 'Compass', 'Cruise', 'Subway', 'Ticket'
  ],
  Hollywood: [
    'Director', 'Oscars', 'Camera', 'Script', 'Stuntman', 'Celebrity', 'Premiere', 'Audition', 'Makeup', 'Casting'
  ]
};

export type ThemeName = keyof typeof WORD_DATABASE;
export const THEMES = Object.keys(WORD_DATABASE) as ThemeName[];
