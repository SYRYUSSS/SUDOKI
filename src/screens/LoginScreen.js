import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { saveAccessToken } from '../services/api';

const API_URL = 'http://192.168.31.177:3000';

export default function LoginScreen({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        await saveAccessToken(data.token);
        onLoginSuccess();
      } else {
        Alert.alert('Ошибка', data.error || 'Неверный email или пароль');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Вход в Судоку</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchToRegister}>
          <Text style={styles.switchText}>Нет аккаунта? Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
    </View>
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