
import React, { useState, useEffect, useCallback } from 'react';
import { Song, Artist, Album, Playlist, FilterCriteria, MockGenerateContentResponse } from './types.ts';
import * as musicService from './services/musicKnowledgeService.ts';
import { interpretQueryWithGemini } from './services/geminiService.ts';
import SearchBar from './components/SearchBar.tsx';
import FilterPanel from './components/FilterPanel.tsx';
import SongCard from './components/SongCard.tsx';
import SongDetailView from './components/SongDetailView.tsx';
import PlaylistManager from './components/PlaylistManager.tsx';
import Modal from './components/common/Modal.tsx';
import LoadingSpinner from './components/common/LoadingSpinner.tsx';
import { APP_TITLE, MusicalNoteIcon, ListBulletIcon } from './constants.tsx';
import Button from './components/common/Button.tsx'; // Ensure Button is imported

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<FilterCriteria>({});
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [llmInterpretation, setLlmInterpretation] = useState<MockGenerateContentResponse | null>(null);
  const [playlistManagerRefreshTrigger, setPlaylistManagerRefreshTrigger] = useState(0); // Used to trigger playlist refresh

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedArtists, fetchedAlbums, initialSongs, fetchedPlaylists] = await Promise.all([
        musicService.getArtists(),
        musicService.getAlbums(),
        musicService.getSongs(),
        musicService.getPlaylists()
      ]);
      setArtists(fetchedArtists);
      setAlbums(fetchedAlbums);
      setSongs(initialSongs);
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  
  const handleSearch = async (query: string, filters?: FilterCriteria) => {
    setIsLoading(true);
    setCurrentQuery(query);
    if(filters) setCurrentFilters(filters);

    setLlmInterpretation(null); // Clear previous interpretation

    try {
      // Simulate LLM interpretation of the query
      if (query) {
        const interpretationResult = await interpretQueryWithGemini(query);
        setLlmInterpretation(interpretationResult);
      }
      
      const results = await musicService.getSongs(filters || currentFilters, query);
      setSongs(results);
    } catch (error) {
      console.error("Error searching songs:", error);
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (criteria: FilterCriteria) => {
    setCurrentFilters(criteria);
    handleSearch(currentQuery, criteria); // Re-search with new filters and existing query
  };

  const handleViewDetails = (song: Song) => {
    setSelectedSong(song);
    setIsDetailModalOpen(true);
  };

  const handleAddToPlaylist = async (playlistId: string, songId: string) => {
    try {
      await musicService.addSongToPlaylist(playlistId, songId);
      // Potentially show a success toast/message
      alert(`Song added to playlist!`);
      const updatedPlaylists = await musicService.getPlaylists(); // Refresh playlist data
      setPlaylists(updatedPlaylists);
      setPlaylistManagerRefreshTrigger(prev => prev + 1); // Trigger PlaylistManager refresh
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      alert("Failed to add song to playlist.");
    }
  };

  const getAlbumForSong = (song: Song): Album | undefined => {
    return albums.find(album => album.id === song.albumId);
  };
  
  const [activeTab, setActiveTab] = useState<'explorer' | 'playlists'>('explorer');


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="bg-slate-850 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <MusicalNoteIcon className="w-10 h-10 text-brand-primary mr-3"/>
            <h1 className="text-3xl font-bold text-white">{APP_TITLE}</h1>
          </div>
          <nav className="flex gap-2">
            <Button 
                variant={activeTab === 'explorer' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('explorer')}
            >
                Explore Songs
            </Button>
            <Button 
                variant={activeTab === 'playlists' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('playlists')}
                leftIcon={<ListBulletIcon className="w-5 h-5"/>}
            >
                My Playlists
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        {activeTab === 'explorer' && (
          <>
            <SearchBar onSearch={(q) => handleSearch(q, currentFilters)} isLoading={isLoading} />
            <FilterPanel onFilterChange={handleFilterChange} initialCriteria={currentFilters} />

            {llmInterpretation && (
              <div className="my-4 p-4 bg-slate-800 rounded-lg shadow">
                <h3 className="text-md font-semibold text-slate-300 mb-1">AI Query Interpretation (Simulated):</h3>
                <p className="text-sm text-slate-400">{llmInterpretation.text}</p>
                 {llmInterpretation.candidates?.[0]?.groundingMetadata?.groundingChunks && (
                    <div className="mt-2">
                        <h4 className="text-xs font-semibold text-slate-400">Sources:</h4>
                        <ul className="list-disc list-inside ml-2 text-xs">
                            {llmInterpretation.candidates[0].groundingMetadata.groundingChunks.map((chunk, idx) => (
                                <li key={idx}>
                                    <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {chunk.web.title || chunk.web.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
            )}

            {isLoading && songs.length === 0 && <LoadingSpinner text="Searching for music..." className="my-10"/>}
            {!isLoading && songs.length === 0 && currentQuery && (
              <p className="text-center text-slate-400 my-10 text-lg">No songs found matching your criteria. Try a different search or adjust filters.</p>
            )}
             {!isLoading && songs.length === 0 && !currentQuery && (
              <p className="text-center text-slate-400 my-10 text-lg">Use the search bar and filters to discover music!</p>
            )}

            {songs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {songs.map(song => (
                  <SongCard
                    key={song.id}
                    song={song}
                    artists={artists}
                    album={getAlbumForSong(song)}
                    onViewDetails={handleViewDetails}
                    onAddToPlaylist={(s) => { /* Quick add could open a small playlist selector modal or add to default */ alert(`Quick add for ${s.title} (not fully implemented). Use 'Details' to add.`);}}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'playlists' && (
            <PlaylistManager 
                onViewSongDetails={handleViewDetails}
                triggerRefresh={playlistManagerRefreshTrigger}
            />
        )}

      </main>

      <footer className="bg-slate-850 text-center p-4 text-sm text-slate-400 border-t border-slate-700">
        &copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved (simulated).
      </footer>

      {selectedSong && (
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="" size="xl">
          <SongDetailView
            song={selectedSong}
            artists={artists}
            album={getAlbumForSong(selectedSong)}
            playlists={playlists}
            onAddToPlaylist={handleAddToPlaylist}
            queryContext={currentQuery || "general interest"}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;