import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

// Заглушка стартовой доски Sudoku (0 - пустая ячейка)
const INITIAL_BOARD = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export default function GameScreen() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedCell, setSelectedCell] = useState(null); // { row, col }

  const handleCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    // Не даем менять исходные фиксированные цифры (где в INITIAL_BOARD != 0)
    if (INITIAL_BOARD[row][col] !== 0) return;

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? num : c))
    );
    setBoard(newBoard);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка игры */}
      <View style={styles.header}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Сложность</Text>
          <Text style={styles.infoValue}>Средняя</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Время</Text>
          <Text style={styles.infoValue}>02:45</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Ошибки</Text>
          <Text style={styles.infoValue}>1/3</Text>
        </View>
      </View>

      {/* Игровое поле 9x9 */}
      <View style={styles.board}>
        {board.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((cell, cIdx) => {
              const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
              const isInitial = INITIAL_BOARD[rIdx][cIdx] !== 0;

              return (
                <TouchableOpacity
                  key={cIdx}
                  style={[
                    styles.cell,
                    cIdx % 3 === 2 && cIdx !== 8 && styles.borderRight,
                    rIdx % 3 === 2 && rIdx !== 8 && styles.borderBottom,
                    isSelected && styles.selectedCell,
                  ]}
                  onPress={() => handleCellPress(rIdx, cIdx)}
                >
                  <Text style={[styles.cellText, isInitial ? styles.initialText : styles.userText]}>
                    {cell !== 0 ? cell : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Цифровая клавиатура */}
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
  container: { flex: 1, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2 },
  infoBox: { alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#6c757d' },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginTop: 2 },
  board: { width: 340, height: 340, backgroundColor: '#212529', borderWidth: 2, borderColor: '#212529', borderRadius: 4 },
  row: { flex: 1, flexDirection: 'row' },
  cell: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#dee2e6' },
  borderRight: { borderRightWidth: 2, borderRightColor: '#212529' },
  borderBottom: { borderBottomWidth: 2, borderBottomColor: '#212529' },
  selectedCell: { backgroundColor: '#e2e3e5' },
  cellText: { fontSize: 20, fontWeight: '600' },
  initialText: { color: '#000', fontWeight: 'bold' },
  userText: { color: '#0d6efd' },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', width: '90%', justifyContent: 'center', gap: 8 },
  numButton: { width: 55, height: 55, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  numButtonText: { fontSize: 22, color: '#0d6efd', fontWeight: 'bold' },
  eraseButton: { backgroundColor: '#f8d7da' },
  eraseText: { fontSize: 20, color: '#dc3545', fontWeight: 'bold' },
});