import { useState, useEffect } from 'react';
import type { SoundItem } from '../types/types';
import { deleteSound, fetchAllSounds } from '../service/service';


export const useSounds = () => {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSounds = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSounds();
      setSounds(data);
      setError(null);
    } catch (err) {
      setError('Failed to load sounds');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeSound = async (id: string) => {
    try {
      await deleteSound(id);
      setSounds(prev => prev.filter(sound => sound._id !== id));
    } catch (err) {
      setError('Failed to delete sound');
      console.error(err);
    }
  };

  useEffect(() => {
    loadSounds();
  }, []);

  return { sounds, loading, error, removeSound, refresh: loadSounds };
};

export const useSoundPlayer = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const playSound = (url: string, id: string) => {
    // If clicking the same sound that's currently playing
    if (currentlyPlaying === id) {
      if (audioInstance) {
        audioInstance.pause();
        setCurrentlyPlaying(null);
      }
      return;
    }

    // Stop any currently playing audio
    if (audioInstance) {
      audioInstance.pause();
    }

    // Play new audio
    const audio = new Audio(url);
    audio.play()
      .then(() => {
        setCurrentlyPlaying(id);
        setAudioInstance(audio);
      })
      .catch(err => {
        console.error('Playback failed:', err);
      });

    audio.onended = () => setCurrentlyPlaying(null);
  };

  return { currentlyPlaying, playSound };
};