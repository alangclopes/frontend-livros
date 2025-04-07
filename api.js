import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-livros-btws.onrender.com/api/',
});

export default api;
