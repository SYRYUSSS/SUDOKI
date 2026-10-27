import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAccessToken } from './src/services/api';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import GameScreen from './src/screens/GameScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('game'); // 'game' | 'profile'

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await getAccessToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return isRegistering ? (
      <RegisterScreen switchToLogin={() => setIsRegistering(false)} />
    ) : (
      <LoginScreen
        onLoginSuccess={() => setIsAuthenticated(true)}
        switchToRegister={() => setIsRegistering(true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'game' ? (
          <GameScreen />
        ) : (
          <ProfileScreen onLogout={() => setIsAuthenticated(false)} />
        )}
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'game' && styles.navActive]}
          onPress={() => setActiveTab('game')}
        >
          <Text style={[styles.navText, activeTab === 'game' && styles.navTextActive]}>🎮 Игра</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'profile' && styles.navActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>👤 Профиль</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navbar: { flexDirection: 'row', height: 60, borderTopWidth: 1, borderTopColor: '#dee2e6', backgroundColor: '#fff' },
  navButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navActive: { borderTopWidth: 3, borderTopColor: '#0d6efd' },
  navText: { fontSize: 16, color: '#6c757d' },
  navTextActive: { color: '#0d6efd', fontWeight: 'bold' },
});