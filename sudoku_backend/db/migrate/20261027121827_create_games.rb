class CreateGames < ActiveRecord::Migration[8.1]
  def change
    create_table :games do |t|
      t.references :user, null: false, foreign_key: true
      t.string :status
      t.string :difficulty
      t.integer :time_spent
      t.json :board
      t.json :solution

      t.timestamps
    end
  end
end
