require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'валидации' do
    subject { User.new(username: 'player1', email: 'test@example.com', password: 'password123') }

    context 'когда данные корректны' do
      it 'успешно проходит валидацию' do
        expect(subject).to be_valid
      end
    end

    context 'когда email отсутствует' do
      it 'возвращает ошибку валидации' do
        subject.email = nil
        expect(subject).not_to be_valid
      end
    end

    context 'когда email или username дублируются' do
      before { subject.save }

      it 'не позволяет создать пользователя с таким же email' do
        duplicate = User.new(username: 'other', email: 'test@example.com', password: 'password123')
        expect(duplicate).not_to be_valid
      end
    end
  end

  describe 'ассоциации' do
    it 'имеет множество игр (has_many :games)' do
      association = described_class.reflect_on_association(:games)
      expect(association.macro).to eq :has_many
    end
  end
end