
export const COLORS = [
  'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Amber', 'Violet', 'Cyan',
  'Indigo', 'Coral', 'Teal', 'Onyx', 'Pearl', 'Sage', 'Ruby', 'Sapphire'
];

export const ANIMALS = [
  'Heron', 'Falcon', 'Lynx', 'Panda', 'Otter', 'Badger', 'Wolf', 'Eagle',
  'Dolphin', 'Tiger', 'Fox', 'Raven', 'Bear', 'Owl', 'Stag', 'Cobra'
];

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
