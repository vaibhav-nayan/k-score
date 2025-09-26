import axios, { type AxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    body?: any; 
}

const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiFetch<T>(path: string, options: CustomAxiosRequestConfig = {}): Promise<T> {
  const url = `${API_URL}/api/v1${path}`;

  try {
    const response = await axios({
      url,
      ...options,
      data: options.body || options.data, 
    });
    return response.data as T;

  } catch (error) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.detail || error.message;

        console.error(`Axios API Error on ${path} (Status ${status}):`, message);
        throw new Error(`API error: ${status} - ${message}`);
    } else {
        console.error(`Unexpected network error on ${path}:`, error);
        throw new Error("Network error occurred.");
    }
  }
}
