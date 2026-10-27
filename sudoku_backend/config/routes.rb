Rails.application.routes.draw do
  resources :users, only: [:create]
  post '/login', to: 'authentication#login'
  resources :games, only: [:create, :update]
  get '/profile', to: 'profile#show'
end