import React from 'react';
import './App.css';

export default function TasksScreen() {
  return (
    <div className="game-screen tasks-screen">
      <h2 style={{color: '#aaa'}}>Здесь будут твои задания</h2>
      <p style={{color: '#777'}}>Выполняй их, чтобы получить больше монет!</p>
    </div>
  );
}