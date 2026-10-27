import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';

const API_URL = 'http://192.168.31.177:3000'; // Твой IP адрес бэкенда

export default function AuthScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');

  const handleSubmit = async () => {
    const endpoint = isRegistering ? `${API_URL}/users` : `${API_URL}/login`;
    const body = isRegistering 
      ? { user: { username, email, password } } 
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        // При логине бэкенд возвращает token (id пользователя)
        // При регистрации бэкенд может вернуть созданного пользователя или нужно сразу авторизовать
        const token = data.token || data.id;
        if (token) {
          onLoginSuccess(token);
        } else {
          Alert.alert('Успех', 'Регистрация прошла успешно! Теперь войдите.');
          setIsRegistering(false);
        }
      } else {
        Alert.alert('Ошибка', data.error || 'Что-то пошло не так');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{isRegistering ? 'Регистрация' : 'Вход в Судоку'}</Text>

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Имя пользователя"
            placeholderTextColor="#adb5bd"
            value={username}
            onChangeText={setUsername}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#adb5bd"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#adb5bd"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isRegistering > 0 ? 'Зарегистрироваться' : 'Войти'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.switchText}>
            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', backgroundColor: '#fff', padding: 24, borderRadius: 16, elevation: 3, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 20 },
  input: { width: '100%', height: 50, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 10, paddingHorizontal: 16, fontSize: 16, marginBottom: 12 },
  button: { width: '100%', height: 50, backgroundColor: '#0d6efd', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  switchText: { color: '#0d6efd', marginTop: 16, fontSize: 14 }
});