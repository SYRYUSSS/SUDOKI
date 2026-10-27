class AuthenticationController < ApplicationController
  def login
    user = User.find_by(email: params[:email])
    
    if user && user.authenticate(params[:password])
      # В простейшем случае пока возвращаем id и имя, 
      # в будущем здесь можно подключить JWT (gem 'jwt')
      render json: { token: user.id, username: user.username }, status: :ok
    else
      render json: { error: 'Неверный email или пароль' }, status: :unauthorized
    end
  end
end