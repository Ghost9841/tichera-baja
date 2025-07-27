import type { SoundItem } from '@/features/sound/types/types';
import axios from 'axios';

// Determine the base URL based on environment
const getBaseUrl = () => {
  // For Vite projects, environment variables start with VITE_
  if(import.meta.env.VITE_API_BASE_URL){
    return import.meta.env.VITE_API_BASE_URL
  } else  {
    return 'https://tichera-baja.onrender.com/api';
  }
  // return 'http://localhost:8000/api';
};

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access - please login');
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('Unknown error occurred');
      }
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const soundApi = {
  getAllSounds: async () => {
    try {
      return await apiClient.get('/sounds');
    } catch (error) {
      console.error('Error fetching sounds:', error);
      throw error;
    }
  },
  
  getSoundById: async (id: string) => {
    try {
      return await apiClient.get(`/sounds/${id}`);
    } catch (error) {
      console.error(`Error fetching sound ${id}:`, error);
      throw error;
    }
  },
  
  deleteSound: async (id: string) => {
    try {
      return await apiClient.delete(`/sounds/${id}`);
    } catch (error) {
      console.error(`Error deleting sound ${id}:`, error);
      throw error;
    }
  },
  
  uploadSound: async (file: File, name: string) => {
    try {
      const formData = new FormData();
      formData.append('audioFile', file);
      formData.append('name', name);
      
      return await apiClient.post('/sounds', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Error uploading sound:', error);
      throw error;
    }
  },
  
  // Optional: Add update method if needed
  updateSound: async (id: string, updates: Partial<SoundItem>) => {
    try {
      return await apiClient.patch(`/sounds/${id}`, updates);
    } catch (error) {
      console.error(`Error updating sound ${id}:`, error);
      throw error;
    }
  }
};

export default apiClient;