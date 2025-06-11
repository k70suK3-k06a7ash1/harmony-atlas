
import { Song, Artist, Album, Playlist, FilterCriteria, Mood, KeySignature } from '../types';

const MOCK_ARTISTS: Artist[] = [
  { id: 'artist1', name: 'The Midnight Moondrops' },
  { id: 'artist2', name: 'Echoes of Andromeda' },
  { id: 'artist3', name: 'Solaris Synthetica' },
  { id: 'artist4', name: 'Nina Simone' },
  { id: 'artist5', name: 'Miles Davis' },
];

const MOCK_ALBUMS: Album[] = [
  { id: 'album1', title: 'Lunar Rhythms', artistIds: ['artist1'], releaseYear: 2022, coverArtUrl: 'https://picsum.photos/seed/album1/300/300' },
  { id: 'album2', title: 'Cosmic Harmonies', artistIds: ['artist2'], releaseYear: 2023, coverArtUrl: 'https://picsum.photos/seed/album2/300/300' },
  { id: 'album3', title: 'Digital Dreams', artistIds: ['artist3'], releaseYear: 2021, coverArtUrl: 'https://picsum.photos/seed/album3/300/300' },
  { id: 'album4', title: 'I Put a Spell on You', artistIds: ['artist4'], releaseYear: 1965, coverArtUrl: 'https://picsum.photos/seed/album4/300/300' },
  { id: 'album5', title: 'Kind of Blue', artistIds: ['artist5'], releaseYear: 1959, coverArtUrl: 'https://picsum.photos/seed/album5/300/300' },
];

const MOCK_SONGS: Song[] = [
  {
    id: 'song1',
    title: 'Neon Interlude',
    artistIds: ['artist1'],
    albumId: 'album1',
    durationSeconds: 245,
    genres: ['Jazz', 'Electronic', 'Chill'],
    moods: [Mood.Calm, Mood.Melancholic, Mood.Chill],
    audioFeatures: { tempo: 90, key: KeySignature.AMinor, mode: 'Minor', energy: 0.4, danceability: 0.6, valence: 0.3, acousticness: 0.1, instrumentalness: 0.8 },
    instrumentation: ['Piano', 'Synthesizer', 'Drums', 'Saxophone'],
    musicTheory: { chordProgressions: ['Am7 - Dm7 - G7 - Cmaj7', 'ii-V-I in A minor'], scalesUsed: ['A Minor Pentatonic', 'Dorian Mode'] },
    coverArtUrl: 'https://picsum.photos/seed/song1/300/300'
  },
  {
    id: 'song2',
    title: 'Starlight Serenade',
    artistIds: ['artist2'],
    albumId: 'album2',
    durationSeconds: 320,
    genres: ['Ambient', 'Classical', 'Electronic'],
    moods: [Mood.Calm, Mood.Uplifting, Mood.Experimental],
    audioFeatures: { tempo: 110, key: KeySignature.CMajor, mode: 'Major', energy: 0.3, danceability: 0.2, valence: 0.6, acousticness: 0.7, instrumentalness: 0.9 },
    instrumentation: ['Strings', 'Synthesizer Pad', 'Piano'],
    musicTheory: { chordProgressions: ['Cmaj7 - Fmaj7 - Gsus - G', 'I-IV-V progression'], scalesUsed: ['C Major Scale', 'Lydian Mode'] },
    coverArtUrl: 'https://picsum.photos/seed/song2/300/300'
  },
  {
    id: 'song3',
    title: 'Cybernetic Pulse',
    artistIds: ['artist3'],
    albumId: 'album3',
    durationSeconds: 180,
    genres: ['Electronic', 'Hip Hop', 'Experimental'],
    moods: [Mood.Energetic, Mood.Dark],
    audioFeatures: { tempo: 140, key: KeySignature.DMinor, mode: 'Minor', energy: 0.8, danceability: 0.7, valence: 0.4, acousticness: 0.05, instrumentalness: 0.6 },
    instrumentation: ['Synthesizer', 'Drum Machine', 'Bass Synth'],
    musicTheory: { chordProgressions: ['Dm - Bb - C - A', 'i-VI-VII-V in D minor'], scalesUsed: ['D Harmonic Minor'] },
    coverArtUrl: 'https://picsum.photos/seed/song3/300/300'
  },
  {
    id: 'song4',
    title: 'Feeling Good',
    artistIds: ['artist4'],
    albumId: 'album4',
    durationSeconds: 177,
    genres: ['Jazz', 'Blues', 'Soul'],
    moods: [Mood.Uplifting, Mood.Energetic],
    audioFeatures: { tempo: 80, key: KeySignature.GMajor, mode: 'Major', energy: 0.5, danceability: 0.3, valence: 0.7, acousticness: 0.8, instrumentalness: 0.1 },
    instrumentation: ['Vocals', 'Piano', 'Bass', 'Drums', 'Horns'],
    musicTheory: { chordProgressions: ['Gm - Ebmaj7 - Cm7 - D7', 'Standard Blues Changes'], scalesUsed: ['G Blues Scale'] },
    coverArtUrl: 'https://picsum.photos/seed/album4/300/300'
  },
  {
    id: 'song5',
    title: 'So What',
    artistIds: ['artist5'],
    albumId: 'album5',
    durationSeconds: 562,
    genres: ['Jazz', 'Modal Jazz'],
    moods: [Mood.Chill, Mood.Melancholic],
    audioFeatures: { tempo: 136, key: KeySignature.DMinor, mode: 'Minor', energy: 0.3, danceability: 0.4, valence: 0.2, acousticness: 0.5, instrumentalness: 0.85 },
    instrumentation: ['Trumpet', 'Saxophone', 'Piano', 'Bass', 'Drums'],
    musicTheory: { chordProgressions: ['Dm7 (16 bars) - Ebm7 (8 bars) - Dm7 (8 bars)'], scalesUsed: ['D Dorian', 'Eb Dorian'] },
    coverArtUrl: 'https://picsum.photos/seed/album5/300/300'
  },
];

// Simulate PGLite/DuckDB for user data (playlists)
const PLAYLIST_STORAGE_KEY = 'musicExplorerPlaylists';

export const getArtists = async (): Promise<Artist[]> => {
  await new Promise(res => setTimeout(res, 100)); // Simulate async
  return MOCK_ARTISTS;
};

export const getArtistById = async (id: string): Promise<Artist | undefined> => {
  await new Promise(res => setTimeout(res, 50));
  return MOCK_ARTISTS.find(artist => artist.id === id);
};

export const getAlbums = async (): Promise<Album[]> => {
  await new Promise(res => setTimeout(res, 100));
  return MOCK_ALBUMS;
};

export const getAlbumById = async (id: string): Promise<Album | undefined> => {
  await new Promise(res => setTimeout(res, 50));
  return MOCK_ALBUMS.find(album => album.id === id);
};

export const getSongs = async (filterCriteria?: FilterCriteria, searchQuery?: string): Promise<Song[]> => {
  await new Promise(res => setTimeout(res, 300)); // Simulate async
  let songs = MOCK_SONGS;

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    songs = songs.filter(song =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.genres.some(genre => genre.toLowerCase().includes(lowerQuery)) ||
      song.instrumentation.some(inst => inst.toLowerCase().includes(lowerQuery)) ||
      MOCK_ARTISTS.filter(a => song.artistIds.includes(a.id)).some(a => a.name.toLowerCase().includes(lowerQuery)) ||
      song.moods.some(mood => mood.toLowerCase().includes(lowerQuery))
    );
  }

  if (filterCriteria) {
    if (filterCriteria.genre) {
      songs = songs.filter(song => song.genres.includes(filterCriteria.genre!));
    }
    if (filterCriteria.mood) {
      songs = songs.filter(song => song.moods.includes(filterCriteria.mood!));
    }
    if (filterCriteria.minTempo) {
      songs = songs.filter(song => song.audioFeatures.tempo >= filterCriteria.minTempo!);
    }
    if (filterCriteria.maxTempo) {
      songs = songs.filter(song => song.audioFeatures.tempo <= filterCriteria.maxTempo!);
    }
    if (filterCriteria.key) {
      songs = songs.filter(song => song.audioFeatures.key === filterCriteria.key!);
    }
    if (filterCriteria.instrument) {
      songs = songs.filter(song => song.instrumentation.includes(filterCriteria.instrument!));
    }
  }
  return songs;
};

export const getSongById = async (id: string): Promise<Song | undefined> => {
  await new Promise(res => setTimeout(res, 50));
  return MOCK_SONGS.find(song => song.id === id);
};

// Playlist Management
export const getPlaylists = async (): Promise<Playlist[]> => {
  await new Promise(res => setTimeout(res, 50));
  const storedPlaylists = localStorage.getItem(PLAYLIST_STORAGE_KEY);
  return storedPlaylists ? JSON.parse(storedPlaylists) : [];
};

export const savePlaylists = async (playlists: Playlist[]): Promise<void> => {
  await new Promise(res => setTimeout(res, 50));
  localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
};

export const createPlaylist = async (name: string, description?: string): Promise<Playlist> => {
  const playlists = await getPlaylists();
  const newPlaylist: Playlist = {
    id: `playlist_${Date.now()}`,
    name,
    songIds: [],
    description
  };
  playlists.push(newPlaylist);
  await savePlaylists(playlists);
  return newPlaylist;
};

export const addSongToPlaylist = async (playlistId: string, songId: string): Promise<Playlist | undefined> => {
  const playlists = await getPlaylists();
  const playlistIndex = playlists.findIndex(p => p.id === playlistId);
  if (playlistIndex > -1 && !playlists[playlistIndex].songIds.includes(songId)) {
    playlists[playlistIndex].songIds.push(songId);
    await savePlaylists(playlists);
    return playlists[playlistIndex];
  }
  return undefined;
};

export const removeSongFromPlaylist = async (playlistId: string, songId: string): Promise<Playlist | undefined> => {
  let playlists = await getPlaylists();
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist) {
    playlist.songIds = playlist.songIds.filter(id => id !== songId);
    await savePlaylists(playlists);
    return playlist;
  }
  return undefined;
};

export const deletePlaylist = async (playlistId: string): Promise<void> => {
  let playlists = await getPlaylists();
  playlists = playlists.filter(p => p.id !== playlistId);
  await savePlaylists(playlists);
};

export const getSongsFromPlaylist = async (playlistId: string): Promise<Song[]> => {
    const playlists = await getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    
    const songs: Song[] = [];
    for (const songId of playlist.songIds) {
        const song = await getSongById(songId);
        if (song) songs.push(song);
    }
    return songs;
};

// Initial data load if localStorage is empty for playlists
(async () => {
  const playlists = await getPlaylists();
  if (playlists.length === 0) {
    const initialPlaylist = await createPlaylist("My Favorites", "A collection of my favorite tracks.");
    if (MOCK_SONGS.length > 0 && initialPlaylist) {
      await addSongToPlaylist(initialPlaylist.id, MOCK_SONGS[0].id);
    }
     if (MOCK_SONGS.length > 1 && initialPlaylist) {
      await addSongToPlaylist(initialPlaylist.id, MOCK_SONGS[1].id);
    }
  }
})();
