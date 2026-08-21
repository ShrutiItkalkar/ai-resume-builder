import { getToken } from '../utils/token';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal request wrapper for frontend API calls
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new Error('Network error. Please check your internet connection or backend server status.');
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    throw new Error(`Server returned unexpected format (${response.status})`);
  }

  if (!response.ok || data.success === false) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = data?.details || null;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
