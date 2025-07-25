import { Music, Play, Trash2 } from "lucide-react";
import type { SoundboardProps,  } from "../types/types";



const Soundboard = ({ sounds, currentlyPlaying, onPlay, onRemove }: SoundboardProps) => {
  return (
    <div className="p-6">
      {sounds.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No sounds added yet</p>
          <p className="text-gray-400">Add some sounds to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sounds.map(sound => (
            <div key={sound.id} className="relative group">
              <button
                onClick={() => onPlay(sound.url, sound.id)}
                className={`w-full p-4 rounded-lg transition-all transform hover:scale-105 shadow-md ${
                  currentlyPlaying === sound.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                }`}
                title={sound.name}
              >
                <Play className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium truncate">{sound.name}</div>
              </button>

              <button
                onClick={() => onRemove(sound.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                title="Remove sound"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Soundboard;