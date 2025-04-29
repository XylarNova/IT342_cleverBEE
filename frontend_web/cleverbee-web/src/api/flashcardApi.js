// 📄 src/api/flashcardApi.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cleverbee-backend.onrender.com/api', // Deployed backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✨ Corrected API Calls
export const getFlashcards = () => api.get('/flashcards');

export const createFlashcards = (flashcardsArray) => api.post('/flashcards', flashcardsArray); 
// MUST PASS an ARRAY

export const updateFlashcard = (id, updatedData) => api.put(`/flashcards/${id}`, updatedData);

export const deleteFlashcard = (id) => api.delete(`/flashcards/${id}`);

export const deleteFlashcardsByCategory = (category) => api.delete(`/flashcards/category/${encodeURIComponent(category)}`);

export default api;
