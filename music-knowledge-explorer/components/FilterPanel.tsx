
import React, { useState } from 'react';
import { FilterCriteria, Mood, KeySignature } from '../types.ts';
import { MOCK_GENRES, MOCK_MOODS, MOCK_KEYS, MOCK_INSTRUMENTS, ChevronDownIcon } from '../constants.tsx';
import Button from './common/Button.tsx';

interface FilterPanelProps {
  onFilterChange: (criteria: FilterCriteria) => void;
  initialCriteria?: FilterCriteria;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, initialCriteria = {} }) => {
  const [criteria, setCriteria] = useState<FilterCriteria>(initialCriteria);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCriteria(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : (value || undefined),
    }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(criteria);
  };

  const handleResetFilters = () => {
    setCriteria({});
    onFilterChange({});
  };

  const renderSelect = (name: keyof FilterCriteria, label: string, options: string[], placeholder: string) => (
    <div className="mb-3">
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={criteria[name] as string || ''}
        onChange={handleChange}
        className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="my-4 p-4 bg-slate-850 rounded-lg shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-lg font-semibold text-slate-100 mb-3 p-2 rounded hover:bg-slate-700 transition-colors"
      >
        Advanced Filters
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSelect('genre', 'Genre', MOCK_GENRES, 'Any Genre')}
          {renderSelect('mood', 'Mood', MOCK_MOODS, 'Any Mood')}
          {renderSelect('key', 'Key Signature', MOCK_KEYS, 'Any Key')}
          {renderSelect('instrument', 'Main Instrument', MOCK_INSTRUMENTS, 'Any Instrument')}
          
          <div className="mb-3">
            <label htmlFor="minTempo" className="block text-sm font-medium text-slate-300 mb-1">Min Tempo (BPM)</label>
            <input type="number" id="minTempo" name="minTempo" value={criteria.minTempo || ''} onChange={handleChange} placeholder="e.g., 80"
                   className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary outline-none" />
          </div>
          <div className="mb-3">
            <label htmlFor="maxTempo" className="block text-sm font-medium text-slate-300 mb-1">Max Tempo (BPM)</label>
            <input type="number" id="maxTempo" name="maxTempo" value={criteria.maxTempo || ''} onChange={handleChange} placeholder="e.g., 140"
                   className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary outline-none" />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-2">
            <Button onClick={handleResetFilters} variant="ghost" size="md">Reset Filters</Button>
            <Button onClick={handleApplyFilters} variant="primary" size="md">Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;