class AuthController < ApplicationController
  # POST /login
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      access_token = JsonWebToken.encode({ user_id: user.id }, 15.minutes.from_now)
      refresh_token = JsonWebToken.encode({ user_id: user.id }, 7.days.from_now)

      user.update(refresh_token: refresh_token)

      render json: { access_token: access_token, refresh_token: refresh_token }, status: :ok
    else
      render json: { error: 'Неверный email или пароль' }, status: :unauthorized
    end
  end

  # POST /refresh
  def refresh
    token = params[:refresh_token]
    decoded = JsonWebToken.decode(token)
    user = User.find_by(id: decoded[:user_id]) if decoded

    if user && user.refresh_token == token
      new_access_token = JsonWebToken.encode({ user_id: user.id }, 15.minutes.from_now)
      render json: { access_token: new_access_token }, status: :ok
    else
      render json: { error: 'Невалидный или просроченный refresh token' }, status: :unauthorized
    end
  end
end