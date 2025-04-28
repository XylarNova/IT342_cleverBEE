import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // Your backend URL
});

// Auto-attach the token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Calls

export const getFlashcards = () => api.get('/flashcards');

export const createFlashcards = (flashcardData) => api.post('/flashcards', flashcardData);

export const deleteFlashcardsByCategory = (category) => api.delete(`/flashcards/category/${encodeURIComponent(category)}`);

export const updateFlashcard = (id, updatedData) => api.put(`/flashcards/${id}`, updatedData);

export const deleteFlashcard = (id) => api.delete(`/flashcards/${id}`);
