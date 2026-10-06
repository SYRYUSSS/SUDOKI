import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { loginRequest, saveTokens } from '../services/api';

export default function LoginScreen({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const data = await loginRequest(email, password);

      if (data.access_token) {
        await saveTokens(data.access_token, data.refresh_token);
        onLoginSuccess();
      } else {
        Alert.alert('Ошибка входа', data.error || 'Неверный логин или пароль');
      }
    } catch (error) {
      Alert.alert('Ошибка сети', 'Не удалось связаться с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SUDOKU</Text>
      <Text style={styles.subtitle}>Вход в аккаунт</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Вход...' : 'Войти'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={switchToRegister} style={styles.linkButton}>
        <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8f9fa' },
  title: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: '#212529', letterSpacing: 2 },
  subtitle: { fontSize: 18, textAlign: 'center', color: '#6c757d', marginBottom: 32, marginTop: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#0d6efd', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#0d6efd', fontSize: 15 },
});