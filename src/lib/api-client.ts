import axios from 'axios';

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          // Unauthorized, redirect to login or refresh token
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 404:
          // Not Found
          console.error('Resource not found');
          break;
        case 500:
          // Server Error
          console.error('Internal server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error', error.message);
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const AuthService = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: any) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// User Profile Services
export const ProfileService = {
  async updateProfile(profileData: any) {
    const response = await apiClient.put('/profile', profileData);
    return response.data;
  },

  async getUserProfile(userId: string) {
    const response = await apiClient.get(`/profile/${userId}`);
    return response.data;
  },
};

// Meme Services
export const MemeService = {
  async searchMemes(params: {
    query?: string;
    page?: number;
    limit?: number;
    mood?: string;
    style?: string;
  } = {}) {
    const response = await apiClient.get('/memes/search', { params });
    return response.data;
  },

  async createMeme(memeData: any) {
    const response = await apiClient.post('/memes', memeData);
    return response.data;
  },

  async getMemeById(memeId: string) {
    const response = await apiClient.get(`/memes/${memeId}`);
    return response.data;
  },
};

// Song/Anthem Services
export const AnthemService = {
  async searchSongs(query: string) {
    const response = await apiClient.get('/anthem/search', { 
      params: { q: query } 
    });
    return response.data;
  },

  async selectAnthem(songData: any) {
    const response = await apiClient.post('/anthem', songData);
    return response.data;
  },
};

export default apiClient;
