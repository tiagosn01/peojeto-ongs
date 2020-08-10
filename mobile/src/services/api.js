import axios from 'axios';

const api = axios.create({
  baseURL: 'http://104.131.57.27/',
});

export default api;
