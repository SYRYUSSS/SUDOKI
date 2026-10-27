class UsersController < ApplicationController
  # POST /signup
  def create
    user = User.new(user_params)
    if user.save
      render json: { message: 'Пользователь успешно зарегистрирован', user: { id: user.id, username: user.username, email: user.email } }, status: :created
    else
      render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end