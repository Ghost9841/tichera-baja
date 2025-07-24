import React, { useState, useEffect } from 'react';
import { fetchFile } from '@ffmpeg/util';
import {  Play, Trash2, Music,  } from 'lucide-react';
import Header from '@/components/Header';
import Tabs from '@/components/Tabs';
import type { SoundItem } from '@/features/converter/types/types';
import ConverTerTab from '@/features/converter/components/ConverTerTab';
import { ffmpeg } from '@/features/converter/services/services';
import SoundBoardTab from '@/features/sound/components/SoundBoardTab';




const MainPage = () => {
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


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <Header />
        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} sounds={sounds.length} />

        {/* Converter Tab */}
        <ConverTerTab
        activeTab={activeTab} 
        ffmpegLoaded={false} 
        videoFile={videoFile} 
        audioUrl={audioUrl} 
        setAudioUrl={setAudioUrl} 
        setProgress={setProgress}
        handleFileChange={handleFileChange}
        converting={converting}
        addToSoundboard={addToSoundboard}
        progress={progress}
        convertToMp3={convertToMp3} />

        {/* Soundboard Tab */}
       <SoundBoardTab 
       activeTab={activeTab}
       currentlyPlaying={currentlyPlaying}
       removeSound={removeSound}
       playSound={playSound}
       sounds={sounds}
       />
      </div>
    </div>
  );
};

export default MainPage;