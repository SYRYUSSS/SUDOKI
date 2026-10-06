import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32;
const CELL_SIZE = BOARD_SIZE / 9;

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

export default function App() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedCell, setSelectedCell] = useState(null);

  // Проверка конфликта (дубликат в строке, столбце или блоке 3x3)
  const isValid = (board, row, col, value) => {
    if (value === 0) return true;
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === value) return false;
      if (i !== row && board[i][col] === value) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) return false;
      }
    }
    return true;
  };

  const handleNumberPress = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (INITIAL_BOARD[row][col] !== 0) return;

    const newBoard = board.map((r, rIdx) =>
      r.map((val, cIdx) => (rIdx === row && cIdx === col ? num : val))
    );
    setBoard(newBoard);
  };

  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col] : null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SUDOKU</Text>

      <View style={styles.board}>
        {board.map((row, rIdx) => (
          <View key={`row-${rIdx}`} style={styles.row}>
            {row.map((value, cIdx) => {
              const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
              const isInitial = INITIAL_BOARD[rIdx][cIdx] !== 0;
              const isSameValue = selectedValue && value === selectedValue && value !== 0;
              const isSameRowOrCol = selectedCell && (selectedCell.row === rIdx || selectedCell.col === cIdx);
              const isInvalid = !isValid(board, rIdx, cIdx, value);

              return (
                <TouchableOpacity
                  key={`cell-${rIdx}-${cIdx}`}
                  style={[
                    styles.cell,
                    isSameRowOrCol && styles.highlightedRowCol,
                    isSameValue && styles.sameValueCell,
                    isSelected && styles.selectedCell,
                    isInvalid && styles.invalidCell,
                    rIdx % 3 === 2 && rIdx !== 8 && styles.borderBottom,
                    cIdx % 3 === 2 && cIdx !== 8 && styles.borderRight,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCell({ row: rIdx, col: cIdx })}
                >
                  <Text style={[
                    styles.cellText, 
                    isInitial && styles.initialText,
                    isInvalid && styles.invalidText
                  ]}>
                    {value !== 0 ? value : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={`key-${num}`}
            style={styles.key}
            onPress={() => handleNumberPress(num)}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.eraseKey} onPress={() => handleNumberPress(0)}>
          <Text style={styles.eraseText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 20,
    color: '#212529',
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderWidth: 2,
    borderColor: '#343a40',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#ced4da',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightedRowCol: {
    backgroundColor: '#f1f3f5',
  },
  sameValueCell: {
    backgroundColor: '#d0ebff',
  },
  selectedCell: {
    backgroundColor: '#a5d8ff',
  },
  invalidCell: {
    backgroundColor: '#ffc9c9',
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#343a40',
  },
  borderRight: {
    borderRightWidth: 2,
    borderRightColor: '#343a40',
  },
  cellText: {
    fontSize: 20,
    color: '#1971c2',
    fontWeight: '500',
  },
  initialText: {
    color: '#212529',
    fontWeight: 'bold',
  },
  invalidText: {
    color: '#e03131',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    width: BOARD_SIZE,
  },
  key: {
    width: CELL_SIZE * 1.2,
    height: CELL_SIZE * 1.2,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
  },
  eraseKey: {
    width: CELL_SIZE * 1.2,
    height: CELL_SIZE * 1.2,
    backgroundColor: '#ffe066',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  eraseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
});