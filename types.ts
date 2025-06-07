
export enum PlayerPosition {
  GK = "Goalkeeper",
  DEF = "Defender",
  MID = "Midfielder",
  FWD = "Forward",
}

export interface Player {
  id: string;
  name: string;
  photoUrl: string;
  skill: number; // 0-99
  age: number; // Added age
  position: PlayerPosition; // Preferred position
  jerseyNumber: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  gamesPlayed: number;
  playablePositions: PlayerPosition[];
}

export interface DraggedPlayerInfo {
  player: Player;
  source: 'bench' | 'pitch';
  sourceIndex?: number; // For pitch source, the slot index
}

export interface SlotPosition {
  row: number;
  col: number;
}

export interface Formation {
  name: string;
  displayNameKey: string; // For i18n
  layout: SlotPosition[]; // Array of 7 slot positions
  visual: string[][]; // For mini-map display
}

export interface TacticalSetup {
  customSetupName: string;
  formationName: string;
  playersOnPitchIds: (string | null)[];
  captainId: string | null;
  penaltyTakerId: string | null;
  cornerTakerId: string | null;
  freeKickTakerId: string | null;
}

// Season Page Specific Types
export interface Match {
  id: string;
  date: string; // YYYY-MM-DD ISO string
  opponent: string;
  time: string; // HH:MM
  isHome: boolean;
  score?: {
    us: number;
    them: number;
  };
  notes?: string;
  matchNotes?: string; // Added for Next Match page notes specific to this match
}

export interface LeagueTableRow {
  rank: number;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TeamStatistic {
  id: string;
  labelKey: string; // For translation, e.g., "goalsFor"
  value: string | number;
  icon?: string; // Optional: icon class or SVG path
}

export interface PlayerStatistic {
  id: string;
  playerName: string;
  statNameKey: string; // For translation, e.g., "topScorer"
  value: string | number;
  playerPhotoUrl?: string; // Optional
}

// For LanguageContext
export type Language = 'en' | 'es';

// For saving all application data
export interface AppData {
  tactician: {
    customSetupName: string;
    selectedFormationName: string;
    playersOnPitchIds: (string | null)[];
    captainId: string | null;
    penaltyTakerId: string | null;
    cornerTakerId: string | null;
    freeKickTakerId: string | null;
  };
  roster: Player[];
  season: {
    matches: Match[];
    leagueTable: LeagueTableRow[];
    teamStats: TeamStatistic[];
    playerStats: PlayerStatistic[];
  };
  settings: {
    language: Language;
    cardScale: number;
  };
  version: string;
}