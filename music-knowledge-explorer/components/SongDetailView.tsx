
import React, { useState, useEffect } from 'react';
import { Song, Artist, Album, Playlist, GroundingChunk } from '../types.ts';
import { generateSongDescriptionWithGemini, generateRecommendationReasonWithGemini } from '../../services/geminiService.ts';
import AudioFeatureDisplay from './visualizations/AudioFeatureDisplay.tsx';
import Button from './common/Button.tsx';
import LoadingSpinner from './common/LoadingSpinner.tsx';
import { PlusIcon, InformationCircleIcon } from '../../constants.tsx';

interface SongDetailViewProps {
  song: Song;
  artists: Artist[];
  album?: Album;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, songId: string) => void;
  queryContext?: string; // For recommendation reason
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-3">
    <p className="text-sm font-semibold text-slate-400">{label}</p>
    <div className="text-slate-200 text-base">{children}</div>
  </div>
);

const SongDetailView: React.FC<SongDetailViewProps> = ({ song, artists, album, playlists, onAddToPlaylist, queryContext }) => {
  const [description, setDescription] = useState<string | null>(null);
  const [recommendationReason, setRecommendationReason] = useState<string | null>(null);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [reasonLoading, setReasonLoading] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [groundingLinks, setGroundingLinks] = useState<GroundingChunk[]>([]);

  const songArtists = artists.filter(artist => song.artistIds.includes(artist.id));
  const artistNames = songArtists.map(a => a.name).join(', ');

  useEffect(() => {
    if (song) {
      setDescriptionLoading(true);
      setReasonLoading(true);
      setGroundingLinks([]); // Reset grounding links for new song
      
      generateSongDescriptionWithGemini(song.title, artistNames)
        .then(response => {
            setDescription(response.text);
            if(response.candidates && response.candidates[0]?.groundingMetadata?.groundingChunks) {
                setGroundingLinks(prev => [...prev, ...response.candidates![0].groundingMetadata!.groundingChunks!]);
            }
        })
        .catch(err => {
            console.error("Error fetching song description:", err);
            setDescription("Could not load AI description.");
        })
        .finally(() => setDescriptionLoading(false));

      if (queryContext) {
        generateRecommendationReasonWithGemini(song.title, queryContext)
          .then(response => {
            setRecommendationReason(response.text);
            if(response.candidates && response.candidates[0]?.groundingMetadata?.groundingChunks) {
                setGroundingLinks(prev => {
                    const newLinks = response.candidates![0].groundingMetadata!.groundingChunks!;
                    // Avoid duplicates by URI
                    const existingUris = new Set(prev.map(link => link.web.uri));
                    const uniqueNewLinks = newLinks.filter(link => !existingUris.has(link.web.uri));
                    return [...prev, ...uniqueNewLinks];
                });
            }
          })
          .catch(err => {
            console.error("Error fetching recommendation reason:", err);
            setRecommendationReason("Could not load AI recommendation reason.");
          })
          .finally(() => setReasonLoading(false));
      } else {
        setRecommendationReason(null); // Clear reason if no context
        setReasonLoading(false);
      }
    }
  }, [song, artistNames, queryContext]);

  const handleAddSongToPlaylist = () => {
    if (selectedPlaylistId && song) {
      onAddToPlaylist(selectedPlaylistId, song.id);
      setSelectedPlaylistId(''); // Reset selector
    }
  };

  if (!song) return <LoadingSpinner text="Loading song details..."/>;

  return (
    <div className="text-slate-100 p-1">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3 flex-shrink-0">
          <img 
            src={song.coverArtUrl || album?.coverArtUrl || 'https://picsum.photos/seed/defaultDetail/400/400'} 
            alt={song.title} 
            className="w-full rounded-lg shadow-lg aspect-square object-cover" 
          />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-white mb-1">{song.title}</h2>
          <p className="text-xl text-slate-300 mb-3">{artistNames}</p>
          {album && <p className="text-md text-slate-400 mb-1">From album: <span className="font-semibold">{album.title} ({album.releaseYear})</span></p>}
          <p className="text-md text-slate-400 mb-4">Duration: {Math.floor(song.durationSeconds / 60)}m {song.durationSeconds % 60}s</p>

          <div className="my-4">
             <h4 className="text-md font-semibold text-slate-200 mb-1">Add to Playlist:</h4>
             <div className="flex gap-2 items-center">
                <select 
                    value={selectedPlaylistId} 
                    onChange={(e) => setSelectedPlaylistId(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-slate-100 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary outline-none flex-grow"
                >
                    <option value="">Select a playlist</option>
                    {playlists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Button onClick={handleAddSongToPlaylist} disabled={!selectedPlaylistId} size="md" leftIcon={<PlusIcon className="w-5 h-5"/>}>
                    Add
                </Button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-100 mb-3 border-b border-slate-700 pb-2">Musical DNA</h3>
          <DetailItem label="Genres">
            {song.genres.join(', ')}
          </DetailItem>
          <DetailItem label="Moods">
            {song.moods.join(', ')}
          </DetailItem>
          <DetailItem label="Instrumentation">
            {song.instrumentation.join(', ')}
          </DetailItem>
          <div className="mt-4">
            <AudioFeatureDisplay features={song.audioFeatures} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-100 mb-3 border-b border-slate-700 pb-2">Music Theory Elements</h3>
          <DetailItem label="Scales Used">
            {song.musicTheory.scalesUsed.length > 0 ? song.musicTheory.scalesUsed.join('; ') : 'N/A'}
          </DetailItem>
          <DetailItem label="Chord Progressions">
            {song.musicTheory.chordProgressions.length > 0 ? (
              <ul className="list-disc list-inside ml-1">
                {song.musicTheory.chordProgressions.map((prog, idx) => <li key={idx}>{prog}</li>)}
              </ul>
            ) : 'N/A'}
          </DetailItem>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-3 border-b border-slate-700 pb-2 flex items-center">
            <InformationCircleIcon className="w-6 h-6 mr-2 text-brand-primary"/> AI Analysis & Insights
        </h3>
        <div className="space-y-4">
            <div>
                <h4 className="text-lg font-semibold text-slate-200 mb-1">AI Generated Description:</h4>
                {descriptionLoading ? <LoadingSpinner size="sm" text="Generating description..." /> : <p className="text-slate-300 bg-slate-850 p-3 rounded-md text-sm leading-relaxed">{description || "No description available."}</p>}
            </div>
            {queryContext && recommendationReason && (
                <div>
                    <h4 className="text-lg font-semibold text-slate-200 mb-1">AI Recommendation Context:</h4>
                    {reasonLoading ? <LoadingSpinner size="sm" text="Generating reason..." /> : <p className="text-slate-300 bg-slate-850 p-3 rounded-md text-sm leading-relaxed">{recommendationReason}</p>}
                </div>
            )}
            {groundingLinks.length > 0 && (
                 <div className="mt-3">
                    <h5 className="text-md font-semibold text-slate-300 mb-1">Sources (Simulated Google Search Grounding):</h5>
                    <ul className="list-disc list-inside ml-1 text-sm space-y-1">
                        {groundingLinks.map((link, idx) => (
                            <li key={idx}>
                                <a href={link.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                                    {link.web.title || link.web.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SongDetailView;