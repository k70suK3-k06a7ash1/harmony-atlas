
import React, { useState, useEffect, useCallback } from 'react';
import { Playlist, Song } from '../types.ts';
import * as musicService from '../services/musicKnowledgeService.ts';
import Button from './common/Button.tsx';
import Modal from './common/Modal.tsx';
import LoadingSpinner from './common/LoadingSpinner.tsx';
import { PlusIcon, XMarkIcon } from '../constants.tsx';

interface PlaylistManagerProps {
  onViewSongDetails: (song: Song) => void;
  triggerRefresh?: number; // To force re-fetch
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({ onViewSongDetails, triggerRefresh }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [songsInSelectedPlaylist, setSongsInSelectedPlaylist] = useState<Song[]>([]);

  const fetchPlaylists = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedPlaylists = await musicService.getPlaylists();
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists, triggerRefresh]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    setIsLoading(true);
    try {
      await musicService.createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsModalOpen(false);
      await fetchPlaylists();
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    setIsLoading(true);
    try {
      await musicService.deletePlaylist(playlistId);
      await fetchPlaylists();
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
        setSongsInSelectedPlaylist([]);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewPlaylist = async (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsLoading(true);
    try {
      const songs = await musicService.getSongsFromPlaylist(playlist.id);
      setSongsInSelectedPlaylist(songs);
    } catch (error) {
      console.error("Error fetching songs for playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSongFromPlaylist = async (songId: string) => {
    if (!selectedPlaylist) return;
    setIsLoading(true);
    try {
      await musicService.removeSongFromPlaylist(selectedPlaylist.id, songId);
      // Re-fetch songs for the current playlist
      const songs = await musicService.getSongsFromPlaylist(selectedPlaylist.id);
      setSongsInSelectedPlaylist(songs);
    } catch (error)
    {
      console.error("Error removing song from playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-4 bg-slate-850 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-100">My Playlists</h2>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm" leftIcon={<PlusIcon className="w-4 h-4"/>}>
          New Playlist
        </Button>
      </div>

      {isLoading && playlists.length === 0 && <LoadingSpinner text="Loading playlists..." />}
      {!isLoading && playlists.length === 0 && <p className="text-slate-400">No playlists yet. Create one!</p>}
      
      {playlists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {playlists.map(playlist => (
            <div key={playlist.id} className={`p-3 rounded-md shadow ${selectedPlaylist?.id === playlist.id ? 'bg-brand-primary/20 ring-2 ring-brand-primary' : 'bg-slate-800 hover:bg-slate-700'} transition-all cursor-pointer`}
                 onClick={() => handleViewPlaylist(playlist)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-100">{playlist.name}</h3>
                  <p className="text-xs text-slate-400">{playlist.songIds.length} song(s)</p>
                </div>
                <Button onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }} variant="danger" size="sm" className="p-1 h-7 w-7">
                  <XMarkIcon className="w-4 h-4"/>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlaylist && (
        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Songs in "{selectedPlaylist.name}"</h3>
          {isLoading && songsInSelectedPlaylist.length === 0 && <LoadingSpinner text="Loading songs..." />}
          {!isLoading && songsInSelectedPlaylist.length === 0 && <p className="text-slate-400">This playlist is empty.</p>}
          {songsInSelectedPlaylist.length > 0 && (
            <ul className="space-y-2">
              {songsInSelectedPlaylist.map(song => (
                <li key={song.id} className="flex justify-between items-center p-2 bg-slate-700 rounded-md">
                  <div>
                    <p className="font-medium text-slate-100 hover:underline cursor-pointer" onClick={() => onViewSongDetails(song)}>{song.title}</p>
                    {/* <p className="text-xs text-slate-400">{song.artists.map(a => a.name).join(', ')}</p> */}
                  </div>
                  <Button onClick={() => handleRemoveSongFromPlaylist(song.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Playlist">
        <div className="space-y-4">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist Name"
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
          />
          <Button onClick={handleCreatePlaylist} variant="primary" disabled={isLoading || !newPlaylistName.trim()} className="w-full">
            {isLoading ? 'Creating...' : 'Create Playlist'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PlaylistManager;