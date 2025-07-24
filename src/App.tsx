// src/App.tsx
import { useState, useEffect } from 'react';
import SoundBoard, { type SoundItem } from './features/sound/components/SoundBoard';
import VideoConverter from './features/converter/page/VideoConverter';
import Soundboard from './features/sound/components/SoundBoard';

export default function App() {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [newSoundName, setNewSoundName] = useState('');
  const [newSoundUrl, setNewSoundUrl] = useState<string | null>(null);

  // Load sounds from localStorage on component mount
  useEffect(() => {
    const savedSounds = localStorage.getItem('soundboardSounds');
    if (savedSounds) {
      try {
        setSounds(JSON.parse(savedSounds));
      } catch (e) {
        console.error('Failed to parse saved sounds', e);
      }
    }
  }, []);

  // Save sounds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('soundboardSounds', JSON.stringify(sounds));
  }, [sounds]);

  const addSound = () => {
    if (newSoundName && newSoundUrl) {
      const newSound: SoundItem = {
        id: Date.now().toString(),
        name: newSoundName,
        url: newSoundUrl
      };
      setSounds(prev => [...prev, newSound]);
      setNewSoundName('');
      setNewSoundUrl(null);
    }
  };

  const removeSound = (id: string) => {
    setSounds(prev => prev.filter(sound => sound.id !== id));
  };



  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Music Extension</h1>
        
        <VideoConverter />
        
        {newSoundUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Add to Soundboard</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSoundName}
                onChange={(e) => setNewSoundName(e.target.value)}
                placeholder="Sound name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addSound}
                disabled={!newSoundName}
                className={`px-4 py-2 rounded transition-colors ${
                  !newSoundName
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Add Sound
              </button>
            </div>
          </div>
        )}
        
        <Soundboard sounds={sounds} onRemoveSound={removeSound} />
      </div>
    </div>
  );
}