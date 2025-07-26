

export interface SoundItem {
  id: string;
  name: string;
  url: string;
}

export interface SoundboardProps {
  sounds: SoundItem[];
  currentlyPlaying: string | null;
  onPlay: (url: string, id: string) => void;
  onRemove: (id: string) => void;
}

