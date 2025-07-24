// src/components/Soundboard.tsx

export interface SoundItem {
  id: string;
  name: string;
  url: string;
}

interface SoundboardProps {
  sounds: SoundItem[];
  onRemoveSound: (id: string) => void;
}

export default function Soundboard({ sounds, onRemoveSound }: SoundboardProps) {
  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error('Playback failed:', e));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Soundboard</h2>
      
      {sounds.length === 0 ? (
        <p className="text-gray-500">No sounds added yet. Convert some MP4 files to get started!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {sounds.map(sound => (
            <div key={sound.id} className="relative group">
              <button
                onClick={() => playSound(sound.url)}
                className="w-full p-3 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors truncate"
                title={sound.name}
              >
                {sound.name}
              </button>
              <button
                onClick={() => onRemoveSound(sound.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove sound"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}