
import { PlayerPosition, Formation } from './types';

export const PITCH_SLOT_COUNT = 7;

export const PLAYER_POSITIONS_LIST: PlayerPosition[] = [
  PlayerPosition.GK,
  PlayerPosition.DEF,
  PlayerPosition.MID,
  PlayerPosition.FWD,
];

export const FORMATIONS: Formation[] = [
  {
    name: "2-3-1",
    displayNameKey: "formation231",
    layout: [
      { col: 1, row: 4 }, // GK
      { col: 2, row: 3 }, // D1 (Left)
      { col: 2, row: 5 }, // D2 (Right) - Moved forward
      { col: 4, row: 2 }, // M1
      { col: 4, row: 4 }, // M2
      { col: 4, row: 6 }, // M3
      { col: 6, row: 4 }, // F
    ],
    visual: [ [" ", "F", " "], ["M", "M", "M"], ["D", " ", "D"], [" ", "G", " "] ] 
  },
  {
    name: "3-1-2",
    displayNameKey: "formation312",
    layout: [
      { col: 1, row: 4 }, // GK
      { col: 2, row: 2 }, // D1 (Left)
      { col: 2, row: 4 }, // D2 (Center)
      { col: 2, row: 6 }, // D3 (Right) - Moved forward
      { col: 4, row: 4 }, // M
      { col: 6, row: 3 }, // F1
      { col: 6, row: 5 }, // F2
    ],
     visual: [ ["F", " ", "F"], [" ", "M", " "], ["D", "D", "D"], [" ", "G", " "] ]
  },
  {
    name: "1-3-2", 
    displayNameKey: "formation132",
    layout: [
      { col: 1, row: 4 }, // GK
      { col: 2, row: 4 }, // D
      { col: 4, row: 2 }, // M1
      { col: 4, row: 4 }, // M2
      { col: 4, row: 6 }, // M3
      { col: 6, row: 3 }, // F1
      { col: 6, row: 5 }, // F2
    ],
    visual: [ ["F", " ", "F"], ["M", "M", "M"], [" ", "D", " "], [" ", "G", " "] ]
  },
   {
    name: "2-1-3",
    displayNameKey: "formation213",
    layout: [
      { col: 1, row: 4 }, // GK
      { col: 2, row: 3 }, // D1 (Left)
      { col: 2, row: 5 }, // D2 (Right) - Moved forward
      { col: 4, row: 4 }, // M 
      { col: 6, row: 2 }, // F1
      { col: 6, row: 4 }, // F2
      { col: 6, row: 6 }, // F3
    ],
    visual: [ ["F", "F", "F"], [" ", "M", " "], ["D", " ", "D"], [" ", "G", " "] ]
  },
  {
    name: "3-2-1",
    displayNameKey: "formation321",
    layout: [
      { col: 1, row: 4 }, // GK
      { col: 2, row: 2 }, // D1 (Left)
      { col: 2, row: 4 }, // D2 (Center)
      { col: 2, row: 6 }, // D3 (Right) - Moved forward
      { col: 4, row: 3 }, // M1
      { col: 4, row: 5 }, // M2
      { col: 6, row: 4 }, // F
    ],
    visual: [ [" ", "F", " "], ["M", " ", "M"], ["D", "D", "D"], [" ", "G", " "] ]
  },
];

export const DEFAULT_FORMATION = FORMATIONS[0];
