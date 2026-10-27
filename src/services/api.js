import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const saveAccessToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, String(token));
  } catch (error) {
    console.error('Ошибка сохранения токена:', error);
  }
};

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Ошибка чтения токена:', error);
    return null;
  }
};

export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Ошибка удаления токена:', error);
  }
};