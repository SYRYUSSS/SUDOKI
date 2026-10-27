class GamesController < ApplicationController
  def create
    token = request.headers['Authorization']
    user = User.find_by(id: token) || User.first

    game = user.games.create!(
      difficulty: params[:difficulty] || 'medium',
      status: 'in_progress'
    )
    
    render json: {
      id: game.id,
      board: game.board,
      status: game.status
    }, status: :created
  end

  def update
    game = Game.find(params[:id])
    row = params[:row].to_i
    col = params[:col].to_i
    value = params[:value].to_i
    time_seconds = params[:time_seconds].to_i

    correct_value = game.solution[row][col]
    is_correct = (value == correct_value || value == 0)

    current_board = game.board
    current_board[row][col] = value
    
    update_params = { board: current_board }

    if current_board == game.solution
      update_params[:status] = 'completed'
      update_params[:time_seconds] = time_seconds if time_seconds > 0
    end

    game.update(update_params)

    render json: {
      board: game.board,
      correct: is_correct,
      status: game.status
    }, status: :ok
  end
end