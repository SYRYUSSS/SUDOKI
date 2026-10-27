import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { logout } from '../services/api';

export default function ProfileScreen({ onLogout, username = 'Player1', email = 'player1@example.com' }) {
  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{username[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>● Авторизован</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Статистика (Заглушка)</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Игр сыграно</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Побед</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>04:15</Text>
            <Text style={styles.statLabel}>Лучшее время</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, marginBottom: 20 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#0d6efd', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  username: { fontSize: 22, fontWeight: 'bold', color: '#212529' },
  email: { fontSize: 14, color: '#6c757d', marginTop: 4, marginBottom: 12 },
  badge: { backgroundColor: '#d1e7dd', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#0f5132', fontSize: 13, fontWeight: '600' },
  statsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, elevation: 2 },
  statsTitle: { fontSize: 16, fontWeight: 'bold', color: '#495057', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#0d6efd' },
  statLabel: { fontSize: 12, color: '#6c757d', marginTop: 4 },
  logoutButton: { backgroundColor: '#dc3545', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});