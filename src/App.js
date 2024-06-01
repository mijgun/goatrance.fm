import React from 'react';
import './App.css';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Goa4Ever Radio</h1>
        <AudioPlayer />
      </header>
    </div>
  );
}

export default App;
