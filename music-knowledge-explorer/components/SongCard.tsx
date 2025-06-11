
import React from 'react';
import { Song, Artist, Album } from '../types.ts';
import Button from './common/Button.tsx';
import { PlayIcon, PlusIcon } from '../constants.tsx';

interface SongCardProps {
  song: Song;
  artists: Artist[];
  album?: Album;
  onViewDetails: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void; // Optional: for quick add
}

const SongCard: React.FC<SongCardProps> = ({ song, artists, album, onViewDetails, onAddToPlaylist }) => {
  const songArtists = artists.filter(artist => song.artistIds.includes(artist.id));
  const artistNames = songArtists.map(a => a.name).join(', ');

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col">
      <div className="relative">
        <img 
            src={song.coverArtUrl || album?.coverArtUrl || 'https://picsum.photos/seed/default/300/300'} 
            alt={song.title} 
            className="w-full h-48 object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3">
            <h3 className="text-lg font-bold text-white truncate" title={song.title}>{song.title}</h3>
            <p className="text-sm text-slate-300 truncate" title={artistNames}>{artistNames}</p>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
            {album && <p className="text-xs text-slate-400 mb-1 truncate">Album: {album.title}</p>}
            <div className="flex flex-wrap gap-1 mb-2">
                {song.genres.slice(0, 2).map(genre => (
                <span key={genre} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{genre}</span>
                ))}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
                {song.moods.slice(0, 2).map(mood => (
                <span key={mood} className="text-xs bg-brand-secondary text-brand-primary px-2 py-0.5 rounded-full border border-brand-primary/50">{mood}</span>
                ))}
            </div>
        </div>

        <div className="flex gap-2 mt-auto pt-3 border-t border-slate-700/50">
          <Button onClick={() => onViewDetails(song)} variant="primary" size="sm" className="flex-1">
            <PlayIcon className="w-4 h-4 mr-1"/> Details
          </Button>
          {onAddToPlaylist && (
            <Button onClick={() => onAddToPlaylist(song)} variant="secondary" size="sm" title="Add to playlist">
              <PlusIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongCard;