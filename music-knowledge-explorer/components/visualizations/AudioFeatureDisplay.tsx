
import React from 'react';
import { AudioFeatures } from '../../types';

interface AudioFeatureDisplayProps {
  features: AudioFeatures;
}

const FeatureBar: React.FC<{ label: string; value: number; maxValue?: number; unit?: string }> = ({ label, value, maxValue = 1, unit = "" }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm text-slate-300 mb-0.5">
        <span>{label}</span>
        <span>{value.toFixed(unit ? 0 : 2)}{unit}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-brand-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        ></div>
      </div>
    </div>
  );
};

const AudioFeatureDisplay: React.FC<AudioFeatureDisplayProps> = ({ features }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-md font-semibold text-slate-200 mb-2">Audio Features</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        <p className="text-sm text-slate-300"><strong className="text-slate-100">Key:</strong> {features.key} ({features.mode})</p>
        <FeatureBar label="Tempo" value={features.tempo} maxValue={220} unit=" BPM" />
        <FeatureBar label="Energy" value={features.energy} />
        <FeatureBar label="Danceability" value={features.danceability} />
        <FeatureBar label="Valence (Mood)" value={features.valence} />
        <FeatureBar label="Acousticness" value={features.acousticness} />
        <FeatureBar label="Instrumentalness" value={features.instrumentalness} />
      </div>
    </div>
  );
};

export default AudioFeatureDisplay;
