import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.31.177:3000';

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
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Неверный email или пароль');
    }

    return data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// Запрос на регистрацию (исправлена обёртка user)
export const registerRequest = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          username,
          email,
          password,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка при регистрации');
    }

    return data;
  } catch (error) {
    console.error('Register Error:', error);
    throw error;
  }
};