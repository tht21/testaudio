
import './App.css';
import AudioPlayer from './Player';
import Lyrics from './lyrics';
function App() {
  return (
    <Lyrics    lyricsUrl="https://storage.googleapis.com/ikara-storage/ikara/lyrics.xml"/>
  );
}

export default App;
