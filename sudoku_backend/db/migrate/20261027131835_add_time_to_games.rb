class AddTimeToGames < ActiveRecord::Migration[8.1]
  def change
    add_column :games, :time_seconds, :integer
  end
end
