import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zen-ai-backend.onrender.com/api', 
});

export default api;
