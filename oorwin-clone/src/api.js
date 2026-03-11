import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zen-ai-backend.onrender.com', // Changed from 5000 to 8080
});

export default api;
