require 'rails_helper'

RSpec.describe "Games API", type: :request do
  let!(:user) { User.create!(username: "testuser", email: "test@example.com", password: "password123") }

  describe "POST /games" do
    it "создает новую игру и возвращает игровую доску" do
      post "/games", params: { difficulty: "medium" }
      
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      
      expect(json["id"]).not_to be_nil
      expect(json["status"]).to eq("in_progress")
      expect(json["board"]).to be_a(Array)
      expect(json["board"].length).to eq(9)
    end
  end

  describe "PATCH /games/:id" do
    let!(:game) { user.games.create!(difficulty: "medium") }

    it "корректно обрабатывает правильный ход" do
      correct_value = game.solution[0][2]

      patch "/games/#{game.id}", params: { row: 0, col: 2, value: correct_value }
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json["board"][0][2]).to eq(correct_value)
      expect(json["correct"]).to be(true)
    end

    it "фиксирует ошибку при неверном ходе" do
      patch "/games/#{game.id}", params: { row: 0, col: 2, value: 9 }
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json["correct"]).to be(false)
    end
  end
end