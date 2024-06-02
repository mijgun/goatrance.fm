import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { METADATA_URL } from './config';

async function fetchMetadata() {
  try {
    const response = await fetch(METADATA_URL);
    const data = await response.json();
    document.getElementById('track-title').textContent = data.track || '';
    document.getElementById('artist-name').textContent = data.artist || '';
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }
}

fetchMetadata();
setInterval(fetchMetadata, 30000);

ReactDOM.render(<App />, document.getElementById('root'));
