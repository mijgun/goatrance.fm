export async function fetchInitialMetadata() {
    try {
      const response = await fetch('https://stream.goatrance.fm/metadata');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return { track: '', artist: '' };
    }
  }
  