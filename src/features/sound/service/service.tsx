import { soundApi } from "@/api/apiClient";
import type { SoundItem } from "../types/types";


export const fetchAllSounds = async (): Promise<SoundItem[]> => {
  try {
    const response = await soundApi.getAllSounds();
    console.log(response)
     if (Array.isArray(response)) {
      return response as SoundItem[];
    }
     if (response?.data) {
      return response.data as SoundItem[];
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching sounds:', error);
    throw error;
  }
};

export const fetchOneSound = async (id: string): Promise<SoundItem> => {
  try {
    const response = await soundApi.getSoundById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sound ${id}:`, error);
    throw error;
  }
};

export const deleteSound = async (id: string): Promise<void> => {
  try {
    await soundApi.deleteSound(id);
  } catch (error) {
    console.error(`Error deleting sound ${id}:`, error);
    throw error;
  }
};

export const uploadSound = async (file: File, name: string): Promise<SoundItem> => {
  try {
    const response = await soundApi.uploadSound(file, name);
    return response.data;
  } catch (error) {
    console.error('Error uploading sound:', error);
    throw error;
  }
};