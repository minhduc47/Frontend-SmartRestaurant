import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/api/v1`,
  withCredentials: true,
});

// ── Auto-refresh state ────────────────────────────────────────────────────────
let isRefreshing = false;
type QueueItem = { resolve: (token: string) => void; reject: (err: unknown) => void };
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

// ── Request interceptor ───────────────────────────────────────────────────────
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
}, function (error) {
  return Promise.reject(error);
});

// ── Response interceptor ──────────────────────────────────────────────────────
instance.interceptors.response.use(function (response) {
  // 2xx: trả về response.data (RestResponse<T> đã được BE wrap)
  if (response && response.data) return response.data;
  return response;
}, async function (error: AxiosError) {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
  const status = error.response?.status;

  // 401: thử refresh token, bỏ qua chính endpoint refresh/login để tránh vòng lặp vô hạn
  if (
    status === 401 &&
    !originalRequest?._retry &&
    !originalRequest?.url?.includes('/auth/refresh') &&
    !originalRequest?.url?.includes('/auth/login')
  ) {
    if (isRefreshing) {
      // Các request đang chờ → xếp hàng, retry khi có token mới
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);
      }).catch(() => {
        return Promise.resolve({ statusCode: 401, error: 'Unauthorized', message: 'Phiên đăng nhập hết hạn.', data: null } as IBackendRes<null>);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await instance.get<IBackendRes<{ access_token: string; user: IUser }>>('/auth/refresh');
      // Interceptor này resolve body trực tiếp → res đã là IBackendRes
      const newToken = (res as unknown as IBackendRes<{ access_token: string }>)?.data?.access_token;
      if (newToken) {
        localStorage.setItem('access_token', newToken);
        instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);
      }
      // Refresh thành công nhưng không có token → đăng xuất
      throw new Error('No token in refresh response');
    } catch {
      processQueue(new Error('Refresh failed'), null);
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      return Promise.resolve({ statusCode: 401, error: 'Unauthorized', message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.', data: null } as IBackendRes<null>);
    } finally {
      isRefreshing = false;
    }
  }

  // 4xx/5xx còn lại: resolve để FE tự kiểm tra res.data / res.error
  if (error.response?.data) return error.response.data;

  // Network error
  return Promise.resolve({
    statusCode: 0,
    error: error.message ?? 'Network Error',
    message: 'Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.',
    data: null,
  } as IBackendRes<null>);
});

export default instance;