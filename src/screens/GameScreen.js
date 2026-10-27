import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { getAccessToken } from '../services/api';

const API_URL = 'http://192.168.31.177:3000';

export default function GameScreen() {
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('in_progress');
  const [errors, setErrors] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');

  // Логика таймера
  useEffect(() => {
    let interval = null;
    if (status === 'in_progress') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    createNewGame(difficulty);
  }, []);

  const createNewGame = async (selectedDifficulty = difficulty) => {
    try {
      setLoading(true);
      setErrors({});
      setSeconds(0);
      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        },
        body: JSON.stringify({ difficulty: selectedDifficulty }),
      });
      const data = await response.json();
      if (response.ok) {
        setGameId(data.id);
        setBoard(data.board);
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Ошибка создания игры:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    createNewGame(newDiff);
  };

  const handleCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = async (num) => {
    if (!selectedCell || !gameId || status !== 'in_progress') return;
    const { row, col } = selectedCell;
    const cellKey = `${row}-${col}`;
    const token = await getAccessToken();

    try {
      const response = await fetch(`${API_URL}/games/${gameId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        },
        body: JSON.stringify({ 
          row, 
          col, 
          value: num,
          time_seconds: seconds 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setBoard(data.board);
        setStatus(data.status);

        setErrors(prev => {
          const updated = { ...prev };
          if (data.correct || num === 0) {
            delete updated[cellKey];
          } else {
            updated[cellKey] = true;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error('Ошибка отправки хода:', error);
    }
  };

  if (loading || !board || board.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
        <Text style={{ marginTop: 10 }}>Загрузка игры с сервера...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.difficultyContainer}>
        {[
          { key: 'easy', label: 'Лёгкий' },
          { key: 'medium', label: 'Средний' },
          { key: 'hard', label: 'Сложный' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.diffButton, difficulty === item.key && styles.diffButtonActive]}
            onPress={() => handleDifficultyChange(item.key)}
          >
            <Text style={[styles.diffButtonText, difficulty === item.key && styles.diffButtonTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.header}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Время</Text>
          <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Статус</Text>
          <Text style={styles.infoValue}>
            {status === 'in_progress' ? 'Идет игра' : status === 'completed' ? 'Победа!' : 'Ошибка'}
          </Text>
        </View>

        <TouchableOpacity style={styles.newGameBtn} onPress={() => createNewGame(difficulty)}>
          <Text style={styles.newGameText}>Заново</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.board}>
        {board.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((cell, cIdx) => {
              const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
              const isError = errors[`${rIdx}-${cIdx}`];
              return (
                <TouchableOpacity
                  key={cIdx}
                  style={[
                    styles.cell,
                    cIdx % 3 === 2 && cIdx !== 8 && styles.borderRight,
                    rIdx % 3 === 2 && rIdx !== 8 && styles.borderBottom,
                    isSelected && styles.selectedCell,
                    isError && styles.errorCell,
                  ]}
                  onPress={() => handleCellPress(rIdx, cIdx)}
                >
                  <Text style={[styles.cellText, isError && styles.errorText]}>
                    {cell !== 0 ? cell : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.numpad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity key={num} style={styles.numButton} onPress={() => handleNumberInput(num)}>
            <Text style={styles.numButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.numButton, styles.eraseButton]} onPress={() => handleNumberInput(0)}>
          <Text style={styles.eraseText}>✕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  difficultyContainer: { flexDirection: 'row', width: '92%', justifyContent: 'space-between', marginBottom: 5 },
  diffButton: { flex: 1, paddingVertical: 8, marginHorizontal: 4, backgroundColor: '#e9ecef', borderRadius: 8, alignItems: 'center' },
  diffButtonActive: { backgroundColor: '#0d6efd' },
  diffButtonText: { fontSize: 13, color: '#495057', fontWeight: '600' },
  diffButtonTextActive: { color: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '92%', backgroundColor: '#fff', padding: 12, borderRadius: 12, elevation: 2, marginBottom: 5 },
  infoBox: { alignItems: 'flex-start' },
  infoLabel: { fontSize: 11, color: '#6c757d' },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: '#0d6efd', marginTop: 2 },
  timerValue: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginTop: 2 },
  newGameBtn: { backgroundColor: '#6c757d', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  newGameText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  board: { width: 340, height: 340, backgroundColor: '#212529', borderWidth: 2, borderColor: '#212529', borderRadius: 4 },
  row: { flex: 1, flexDirection: 'row' },
  cell: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#dee2e6' },
  borderRight: { borderRightWidth: 2, borderRightColor: '#212529' },
  borderBottom: { borderBottomWidth: 2, borderBottomColor: '#212529' },
  selectedCell: { backgroundColor: '#e2e3e5' },
  errorCell: { backgroundColor: '#f8d7da' },
  cellText: { fontSize: 20, fontWeight: '600', color: '#0d6efd' },
  errorText: { color: '#dc3545' },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', width: '90%', justifyContent: 'center', gap: 8 },
  numButton: { width: 55, height: 55, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  numButtonText: { fontSize: 22, color: '#0d6efd', fontWeight: 'bold' },
  eraseButton: { backgroundColor: '#f8d7da' },
  eraseText: { fontSize: 20, color: '#dc3545', fontWeight: 'bold' },
});