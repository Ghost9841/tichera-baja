import type { SoundItem } from "../components/SoundBoard";

export interface SoundBoardTabProps {
    activeTab: "converter" | "soundboard";
    currentlyPlaying: string | null;
    playSound: (url: string, id: string) => void;
    removeSound: (id: string) => void;
    sounds: SoundItem[];
}