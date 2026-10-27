class Game < ApplicationRecord
  belongs_to :user

  before_create :setup_board

  private

  def setup_board
    # Полное решенное судоку (базовый пример валидного поля)
    complete_board = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]

    self.solution = complete_board
    
    # Определяем количество скрытых ячеек в зависимости от сложности
    holes = case difficulty
            when 'easy' then 30   # Больше подсказок
            when 'medium' then 40 # Средне
            when 'hard' then 52   # Мало подсказок, сложнее
            else 40
            end

    # Создаем копию доски и убираем случайные ячейки (заменяем на 0)
    current_board = complete_board.map(&:dup)
    removed = 0
    while removed < holes
      row = rand(9)
      col = rand(9)
      if current_board[row][col] != 0
        current_board[row][col] = 0
        removed += 1
      end
    end

    self.board = current_board
  end
end