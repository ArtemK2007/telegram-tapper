import React, { useState } from 'react';

// Компонент модального окна
export default function NameModal({ onSubmit, isLoading }) {
  const [name, setName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      onSubmit(name.trim()); // Отправляем имя наверх в App.jsx
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="name-modal">
        <h2 className="modal-title">Как вас зовут?</h2>
        <p className="modal-text">Введите имя, чтобы начать игру.</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя игрока"
          required
          minLength="2"
          maxLength="20"
          className="name-input"
          disabled={isLoading}
        />
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Сохраняем...' : 'Начать'}
        </button>
      </form>
    </div>
  );
}