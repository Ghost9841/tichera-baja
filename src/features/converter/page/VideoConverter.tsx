import React, { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { UploadCloud, Download, Play, Trash2, Music, Film } from 'lucide-react';
import type { SoundItem } from '../types/types';

const ffmpeg = new FFmpeg();



const VideoConverter = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState('');
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [activeTab, setActiveTab] = useState<'converter' | 'soundboard'>('converter');
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Load sounds from memory on component mount
  useEffect(() => {
    // Since we can't use localStorage, sounds will only persist during the session
    // In a real app, you'd want to use a backend or localStorage
  }, []);

  // Initialize FFmpeg
  useEffect(() => {
    const loadFFmpeg = async () => {
      if (!ffmpeg.loaded) {
        ffmpeg.on('log', ({ message }) => {
          setProgress(message);
        });
        
        ffmpeg.on('progress', ({ progress: prog }) => {
          setProgress(`Converting... ${Math.round(prog * 100)}%`);
        });

        try {
          await ffmpeg.load();
          setFfmpegLoaded(true);
          setProgress('FFmpeg loaded successfully!');
        } catch (error) {
          setProgress('Failed to load FFmpeg');
          console.error('FFmpeg load error:', error);
        }
      }
    };
    loadFFmpeg();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioUrl(null);
    setProgress('');
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const convertToMp3 = async () => {
    if (!videoFile || !ffmpegLoaded) return;
    
    setConverting(true);
    setProgress('Starting conversion...');

    try {
      const fileExtension = getFileExtension(videoFile.name);
      const inputFileName = `input.${fileExtension}`;
      const outputFileName = 'output.mp3';

      setProgress('Writing file to FFmpeg...');
      await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));
      
      setProgress('Converting to MP3...');
      await ffmpeg.exec([
        '-i', inputFileName, 
        '-vn', // No video
        '-ar', '44100', // Sample rate
        '-ac', '2', // Stereo
        '-b:a', '192k', // Bitrate
        outputFileName
      ]);

      setProgress('Reading converted file...');
      const data = await ffmpeg.readFile(outputFileName);
      const blob = new Blob([data], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
      setProgress('Conversion completed!');
      
      // Auto-switch to soundboard if conversion successful
      setTimeout(() => setActiveTab('soundboard'), 1000);
      
    } catch (error) {
      setProgress('Conversion failed: ' + (error as Error).message);
      console.error('Conversion error:', error);
    } finally {
      setConverting(false);
    }
  };

  const addToSoundboard = () => {
    if (!audioUrl || !videoFile) return;

    const newSound: SoundItem = {
      id: Date.now().toString(),
      name: videoFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
      url: audioUrl,
      blob: new Blob() // In a real app, you'd store the actual blob
    };

    setSounds(prev => [...prev, newSound]);
    setProgress('Added to soundboard!');
  };

  const playSound = (url: string, id: string) => {
    // Stop currently playing sound
    if (currentlyPlaying) {
      setCurrentlyPlaying(null);
    }

    const audio = new Audio(url);
    setCurrentlyPlaying(id);
    
    audio.play().catch(e => {
      console.error('Playback failed:', e);
      setCurrentlyPlaying(null);
    });

    audio.onended = () => setCurrentlyPlaying(null);
    audio.onerror = () => setCurrentlyPlaying(null);
  };

  const removeSound = (id: string) => {
    setSounds(prev => prev.filter(sound => sound.id !== id));
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    }
  };

  const downloadAudio = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="w-8 h-8" />
            Video to Audio Converter & Soundboard
          </h1>
          <p className="mt-2 opacity-90">Convert MP4, WebM, and other video formats to MP3</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'converter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Film className="w-5 h-5 inline mr-2" />
            Converter
          </button>
          <button
            onClick={() => setActiveTab('soundboard')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'soundboard'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Music className="w-5 h-5 inline mr-2" />
            Soundboard ({sounds.length})
          </button>
        </div>

        {/* Converter Tab */}
        {activeTab === 'converter' && (
          <div className="p-6">
            <div className="max-w-md mx-auto text-center">
              {!ffmpegLoaded && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                  Loading FFmpeg... This may take a moment.
                </div>
              )}

              <label className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
                <UploadCloud className="w-5 h-5" />
                Upload Video File
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              <div className="mt-4 text-sm text-gray-600">
                Supports: MP4, WebM, AVI, MOV, MKV, and more
              </div>

              {videoFile && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="font-medium text-gray-800">{videoFile.name}</p>
                  <p className="text-sm text-gray-600">
                    Size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <button
                disabled={!videoFile || converting || !ffmpegLoaded}
                onClick={convertToMp3}
                className="mt-4 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {converting ? 'Converting...' : 'Convert to MP3'}
              </button>

              {progress && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">{progress}</p>
                </div>
              )}

              {audioUrl && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-3">Conversion Complete!</h3>
                  <audio controls src={audioUrl} className="w-full mb-3" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadAudio(audioUrl, videoFile?.name.replace(/\.[^/.]+$/, "") || "converted")}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={addToSoundboard}
                      className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                      Add to Soundboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Soundboard Tab */}
        {activeTab === 'soundboard' && (
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your Soundboard</h2>
              <p className="text-gray-600">Click any sound to play it instantly</p>
            </div>

            {sounds.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No sounds added yet</p>
                <p className="text-gray-400">Convert some videos to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sounds.map(sound => (
                  <div key={sound.id} className="relative group">
                    <button
                      onClick={() => playSound(sound.url, sound.id)}
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
                      onClick={() => removeSound(sound.id)}
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
        )}
      </div>
    </div>
  );
};

export default VideoConverter;