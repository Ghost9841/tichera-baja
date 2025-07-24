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

export interface ConverterTabProps {
    activeTab: 'converter' | 'soundboard';
    ffmpegLoaded: boolean;
    videoFile: File | null;
    audioUrl: string | null;
    setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
    setProgress: React.Dispatch<React.SetStateAction<string>>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    converting: boolean;
    addToSoundboard: () => void;
    progress: string;
    convertToMp3: () => Promise<void>;
}
