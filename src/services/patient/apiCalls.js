import { api } from './api';
import { userAuth, refreshToken } from '../../const/localStorage';
import { persistor } from '../../app/store';
import { BASE_URL } from '../../const/url';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // or your preferred routing solution

// Function to clear user data and navigate to login
export const clearUser = () => {
  localStorage.removeItem(userAuth);
  localStorage.removeItem(refreshToken);
  persistor.purge();
  window.location.reload("/login");
};

// Function to make API calls with retry logic for token refresh
export const apiCall = async (method, url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
      let error;

      // Determine HTTP method for request
      switch (method) {
        case 'post':
          response = await api.post(url, data).catch((err) => { error = err; });
          break;
        case 'get':
          response = await api.get(url, data).catch((err) => { error = err; });
          break;
        case 'patch':
          response = await api.patch(url, data).catch((err) => { error = err; });
          break;
        case 'delete':
          response = await api.delete(url, data).catch((err) => { error = err; });
          break;
        case 'put':
          response = await api.put(url, data).catch((err) => { error = err; });
          break;
        default:
          throw new Error('Invalid HTTP method');
      }

      // Handle response or error
      if (response) {
        resolve(response);
      } else if (error) {
        console.log('Error response:', error);

        // Handle forbidden error
        if (error?.response?.status === 403 && error?.response?.data?.error_code === 'FORBIDDEN') {
          clearUser();
        }

        // Handle unauthorized error
        if (error?.response?.status === 401) {
          try {
            const newTokenResponse = await refreshAccessToken(error);
            resolve(newTokenResponse?.data);
          } catch (refreshError) {
            if (refreshError.response?.status === 401) {
              clearUser();
            } else {
              reject(refreshError);
            }
          }
        } else {
          reject(error?.response?.data);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

// Function to refresh access token
const refreshAccessToken = async (error) => {
  try {
    const tokenRefresh = localStorage.getItem(refreshToken);

    if (tokenRefresh) {

      const response = await axios.post(
        `${BASE_URL}/api/auth/patient/refresh-token`,
        null,
        { headers: { Authorization: tokenRefresh } }
      );

      const newAccessToken = response.data.newToken;
      localStorage.setItem(userAuth, newAccessToken);
      error.config.headers['Authorization'] = newAccessToken;
      return axios(error.config);
    } else {
      clearUser();
    }
  } catch (error) {
    clearUser();
    throw error;
  }
};
