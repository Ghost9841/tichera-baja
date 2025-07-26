import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import type { SoundItem } from '../types/types';
import Soundboard from '../components/SoundBoard';

const SoundPage = () => {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const playSound = (url: string, id: string) => {
    // Stop currently playing sound if any
    if (currentlyPlaying) {
      setCurrentlyPlaying(null);
    }
    
    const audio = new Audio(url);
    audio.play()
      .catch(e => console.error('Playback failed:', e));
    setCurrentlyPlaying(id);
    
    audio.onended = () => setCurrentlyPlaying(null);
  };

  const removeSound = (id: string) => {
    setSounds(prev => prev.filter(sound => sound.id !== id));
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    }
  };

  const filteredSounds = sounds.filter(sound =>
    sound.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-gray-800">Soundboard</h1>
        <SearchBar onSearch={setSearchTerm} />
      </div>
      
      <Soundboard 
        sounds={filteredSounds}
        currentlyPlaying={currentlyPlaying}
        onPlay={playSound}
        onRemove={removeSound}
      />
    </div>
  );
};

export default SoundPage;