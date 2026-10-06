import * as SecureStore from 'expo-secure-store';

// Укажи IP-адрес своего компьютера в локальной сети (например, http://192.168.1.50:3000)
const API_BASE_URL = 'http://localhost:3000'; 

// Сохранение токенов в памяти телефона
export const saveTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync('access_token', accessToken);
  await SecureStore.setItemAsync('refresh_token', refreshToken);
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('access_token');
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refresh_token');
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
};

// Запрос на вход
export const loginRequest = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Запрос на регистрацию
export const registerRequest = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
};