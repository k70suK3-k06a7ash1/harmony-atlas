
export enum Mood {
  Happy = "Happy",
  Sad = "Sad",
  Energetic = "Energetic",
  Calm = "Calm",
  Romantic = "Romantic",
  Melancholic = "Melancholic",
  Uplifting = "Uplifting",
  Dark = "Dark",
  Chill = "Chill",
  Experimental = "Experimental"
}

export enum KeySignature {
  CMajor = "C Major",
  AMinor = "A Minor",
  GMajor = "G Major",
  EMinor = "E Minor",
  DMajor = "D Major",
  BMinor = "B Minor",
  FMajor = "F Major",
  DMinor = "D Minor",
  // ... add more as needed
}

export interface AudioFeatures {
  tempo: number; // BPM
  key: KeySignature;
  mode: "Major" | "Minor";
  energy: number; // 0.0 to 1.0
  danceability: number; // 0.0 to 1.0
  valence: number; // Positiveness 0.0 to 1.0 (correlates with mood)
  acousticness: number; // 0.0 to 1.0
  instrumentalness: number; // 0.0 to 1.0
}

export interface MusicTheoryInfo {
  chordProgressions: string[]; // e.g., ["Am - G - C - F", "ii-V-I in C Major"]
  scalesUsed: string[]; // e.g., ["A Minor Pentatonic", "C Major Scale"]
}

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  title: string;
  artistIds: string[];
  releaseYear: number;
  coverArtUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  artistIds: string[];
  albumId: string;
  durationSeconds: number;
  genres: string[];
  moods: Mood[];
  audioFeatures: AudioFeatures;
  instrumentation: string[]; // e.g., ["Piano", "Drums", "Bass", "Saxophone"]
  musicTheory: MusicTheoryInfo;
  coverArtUrl?: string; // Optional: can be same as album or unique
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  description?: string;
}

export interface FilterCriteria {
  genre?: string;
  mood?: Mood;
  minTempo?: number;
  maxTempo?: number;
  key?: KeySignature;
  instrument?: string;
}

// For grounding metadata simulation
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web: GroundingChunkWeb;
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}
export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Other candidate properties if needed
}
export interface MockGenerateContentResponse {
  text: string;
  candidates?: Candidate[];
}
