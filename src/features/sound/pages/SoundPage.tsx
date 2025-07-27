import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import type { SoundItem } from '../types/types';
import { fetchAllSounds } from '../service/service';
import Soundboard from '../components/SoundBoard';

const SoundPage = () => {
  const [sounds, setSounds] = useState<SoundItem[]>([]); // Initialized as empty array
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const loadSounds = async () => {
    try {
      const sounds = await fetchAllSounds();
      setSounds(sounds || []); // Directly use the array
      
    } catch (err) {
      console.error('Failed to load sounds:', err);
    } finally {
      setLoading(false);
    }
  };
  loadSounds();
}, []);

const playSound = (url: string, id: string) => {
  // Fix the URL by adding '/api' if missing
  let correctedUrl = url;
  if (url.includes('/uploads/') && !url.includes('/api/uploads/')) {
    correctedUrl = url.replace('/uploads/', '/api/uploads/');
  }

  // Stop currently playing sound if any
  if (currentlyPlaying === id) {
    setCurrentlyPlaying(null);
    return;
  }

  const audio = new Audio(correctedUrl);
  audio.play()
    .then(() => setCurrentlyPlaying(id))
    .catch(err => {
      console.error('Playback failed:', err);
      // Try the original URL as fallback
      const fallbackAudio = new Audio(url);
      fallbackAudio.play()
        .then(() => setCurrentlyPlaying(id))
        .catch(fallbackErr => {
          console.error('Fallback playback failed:', fallbackErr);
        });
    });

  audio.onended = () => setCurrentlyPlaying(null);
};
  const removeSound = (id: string) => {
    setSounds(prev => prev?.filter(sound => sound._id !== id) || []);
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    }
  };

  // Safe filtering with null checks
  const filteredSounds = sounds?.filter(sound =>
    sound.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) return <div>Loading sounds...</div>;
  if (error) return <div>Error: {error}</div>;

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