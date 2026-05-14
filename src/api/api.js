import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
});

export const fetchPanels = ({ page = 1, limit = 12, search, category, color, style }) =>
  api.get('/panel-cat', {
    params: {
      page,
      limit,
      search: search || undefined,
      category: category || undefined,
      color: color || undefined,
      style: style || undefined,
    },
  });

export const fetchPanelById = (id) => api.get(`/panel-cat/${id}`);

export const sendChatMessage = (payload) => api.post('/chat', payload);

export default api;
