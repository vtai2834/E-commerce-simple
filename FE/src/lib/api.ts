import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const register = (data: { email: string; password: string; fullName: string }) => {
  return api.post('/auth/register', data);
};

export const getProfile = () => {
  return api.get('/auth/profile');
};

// Product APIs
export const getProducts = () => {
  return api.get('/products');
};

export const getProduct = (id: string) => {
  return api.get(`/products/${id}`);
};

export const createProduct = (productData: any) => {
  return api.post('/products', productData);
};

export const updateProduct = (id: string, productData: any) => {
  return api.patch(`/products/${id}`, productData);
};

export const deleteProduct = (id: string) => {
  return api.delete(`/products/${id}`);
};

// Order APIs
export const getOrders = () => {
  return api.get('/orders');
};

export const getOrder = (id: string) => {
  return api.get(`/orders/${id}`);
};

export const createOrder = (orderData: {
  userId: string;
  userEmail: string;
  items: Array<{ productId: string; quantity: number; }>;
}) => {
  return api.post('/orders', orderData);
};

export const getUserOrders = (userId: string) => {
  return api.get(`/orders/user/${userId}`);
};

export const updateOrder = (id: string, updateData: any) => {
  return api.patch(`/orders/${id}`, updateData);
};

export const deleteOrder = (id: string) => {
  return api.delete(`/orders/${id}`);
};

export default api; 