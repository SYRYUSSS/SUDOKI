class ProfileController < ApplicationController
  def show
    token = request.headers['Authorization']
    user = User.find_by(id: token) || User.first # Или поиск по токену аутентификации

    if user
      games = user.games
      total_games = games.count
      completed_games = games.where(status: 'completed')
      wins = completed_games.count
      best_time_seconds = completed_games.minimum(:time_seconds)

      render json: {
        username: user.username,
        email: user.email,
        stats: {
          total_games: total_games,
          wins: wins,
          best_time: best_time_seconds ? format_time(best_time_seconds) : '--:--'
        }
      }, status: :ok
    else
      render json: { error: 'Не авторизован' }, status: :unauthorized
    end
  end

  private

  def format_time(total_seconds)
    mins = total_seconds / 60
    secs = total_seconds % 60
    format('%02d:%02d', mins, secs)
  end
end