import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {showText ? (
          <p style={{ fontSize: '3em', fontWeight: 'bold', color: '#61dafb' }}>
            Soon.....
          </p>
        ) : (
          <p style={{ fontSize: '1.5em', color: '#aaa' }}>
            Loading future greatness...
          </p>
        )}
      </header>
    </div>
  );
}

export default App;