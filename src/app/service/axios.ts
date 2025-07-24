import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/',
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosClient;