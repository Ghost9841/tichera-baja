

export interface SoundItem {
  _id: string;
  name: string;
  url: string;
  duration?: number;
  createdAt?: string;
}

export interface SoundboardProps {
  sounds: SoundItem[];
  currentlyPlaying: string | null;
  onPlay: (url: string, id: string) => void;
  onRemove: (id: string) => void;
}

