
import React from 'react';
import { Mood, KeySignature } from './types';

export const APP_TITLE = "Music Knowledge Explorer";

export const MOCK_GENRES = ["Jazz", "Rock", "Classical", "Electronic", "Hip Hop", "Blues", "Folk", "Pop", "Ambient"];
export const MOCK_MOODS: Mood[] = Object.values(Mood);
export const MOCK_KEYS: KeySignature[] = Object.values(KeySignature);
export const MOCK_INSTRUMENTS = ["Piano", "Guitar", "Drums", "Bass", "Violin", "Saxophone", "Trumpet", "Synthesizer", "Vocals"];

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002"; // Though not used in this app


// SVG Icons (Heroicons)
export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const MusicalNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7.5 3.75a.75.75 0 0 0-1.5 0v10.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V3.75Zm-3.75 16.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm12-3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
    <path d="M10.732 3.715a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v7.606a4.5 4.5 0 0 1-3.09 4.233.75.75 0 0 1-.9-.675V13.5a3 3 0 0 0-3-3V3.715Z" />
    <path d="M10.5 9.75A.75.75 0 0 0 11.25 9h1.5a.75.75 0 0 0 0-1.5h-1.5A.75.75 0 0 0 10.5 9Z" />
  </svg>
);

export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
  </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const InformationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.042.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.67-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
);

export const ListBulletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.625 6.75a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 0 1.5H3.375a.75.75 0 0 1-.75-.75Zm0 0A.75.75 0 0 1 3.375 6h17.25a.75.75 0 0 1 0 1.5H3.375a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 0 1.5H3.375a.75.75 0 0 1-.75-.75Zm0 0A.75.75 0 0 1 3.375 11.25h17.25a.75.75 0 0 1 0 1.5H3.375a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 0 1.5H3.375a.75.75 0 0 1-.75-.75Zm0 0A.75.75 0 0 1 3.375 16.5h17.25a.75.75 0 0 1 0 1.5H3.375a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);
