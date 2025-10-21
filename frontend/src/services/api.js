import axios from 'axios';

// 1. Get credentials [cite: 219, 220]
const USERNAME = 'admin';
const PASSWORD = 'password123';

// 2. Encode them for the Basic Auth header
// btoa() creates a Base64-encoded string
const encodedCredentials = btoa(`${USERNAME}:${PASSWORD}`);

// 3. Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend URL
  headers: {
    // 4. Set the Authorization header for all requests [cite: 222, 225]
    'Authorization': `Basic ${encodedCredentials}`
  }
});

// Interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized globally
      alert(error.response.data.error || 'Unauthorized. Please check credentials.');
    }
    return Promise.reject(error);
  }
);

export default api;