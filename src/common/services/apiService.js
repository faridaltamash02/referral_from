// src/apiService.js

import axios from 'axios';
import { useLoader } from './context/loadingContext';



//const API_URL = 'https://api.example.com'; // Replace with your API base URL
let dynamicURL = window.location.origin.includes('staging') ? 'https://uat.newfi.com/loancenter' : 'https://app.newfi.com/loancenter';
const API_URL = dynamicURL || 'https://uat.newfi.com/loancenter'; // Replace with your API base URL


const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers here
  },
});

// Function to handle GET requests
const get = (url, config = {}) => {
  return apiClient.get(url, config);
};

// Function to handle POST requests
const post = (url, data, config = {}) => {
  return apiClient.post(url, data, config);
};

// Function to handle PUT requests
const put = (url, data, config = {}) => {
  return apiClient.put(url, data, config);
};

// Function to handle DELETE requests
const del = (url, config = {}) => {
  return apiClient.delete(url, config);
};

export const setupInterceptors = (loaderContext) => {
  const { showLoader, hideLoader } = loaderContext;
  apiClient.interceptors.request.use(
    (config) => {
      showLoader(); // Show loader before request is sent
      return config;
    },
    (error) => {
      hideLoader(); // Hide loader if request fails
      return Promise.reject(error);
    }
  );
  
  // Response interceptor to hide loader
  apiClient.interceptors.response.use(
    (response) => {
      hideLoader(); // Hide loader on response
      return response;
    },
    (error) => {
      hideLoader(); // Hide loader on error response
      return Promise.reject(error);
    }
  );
}


export default {
  get,
  post,
  put,
  delete: del,
};
