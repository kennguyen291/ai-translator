import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://u8tcq5rvi3.execute-api.ap-southeast-2.amazonaws.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosClient; 