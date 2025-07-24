export interface SoundItem {
  id: string;
  name: string;
  url: string;
  blob: Blob;
}

export interface TabsProps {
  activeTab: 'converter' | 'soundboard';
  setActiveTab: (tab: 'converter' | 'soundboard') => void;
  sounds: number;
}