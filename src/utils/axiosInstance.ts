import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

type QueueEntry = { resolve: () => void; reject: (err: unknown) => void };

let isRefreshing = false;
let queue: QueueEntry[] = [];

function flushQueue(error?: unknown) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  queue = [];
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  const { pathname } = window.location;
  if (pathname.startsWith('/auth') || pathname.startsWith('/admin')) return;
  window.location.href = '/auth/login';
}

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Skip the refresh endpoint itself to avoid infinite loops
    if (original.url?.includes('/auth/refresh')) {
      redirectToLogin();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => axiosInstance(original));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await axiosInstance.post('/auth/refresh');
      flushQueue();
      return axiosInstance(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
