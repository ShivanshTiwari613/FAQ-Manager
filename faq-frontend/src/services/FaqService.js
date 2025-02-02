// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const createFaq = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/faq`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    throw error;
  }
};

export const getFaqs = async () => {
  const response = await axios.get(`${API_BASE_URL}/faq`);
  return response.data;
};
