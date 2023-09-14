import React, { useState, useEffect, useRef } from 'react';
import xml2js from 'xml2js';

function Lyrics({ lyricsUrl }) {
  const [lyrics, setLyrics] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const audioUrl = 'https://storage.googleapis.com/ikara-storage/tmp/beat.mp3';

  useEffect(() => {
    fetch(lyricsUrl)
      .then(response => response.text())
      .then(data => {
        xml2js.parseString(data, (err, result) => {
          if (err) {
            console.error('Failed to parse xml', err);
            return;
          }

          const lines = result.data.param.map(param =>

            param.i.map(word => ({
              time: parseFloat(word.$.va),
              text: word._
            }))
          );
          setLyrics(lines);
        });
      })
      .catch(error => {
        console.log('There was a problem with the fetch operation:', error.message);
      });
  }, [lyricsUrl]);

  return (

    <body>

      <div id="music-player">
        <img id="album-art" />
        <div id="top-bar">
          <button id="back"><i class="fa fa-arrow-left"></i></button>
          <div id="about-song">
            <h2 class="song-name"></h2>
            <h4 class="artist-name"></h4>
          </div>
        </div>
        <div id="lyrics">
          {lyrics.map((line, lineIndex) => (
            <p key={lineIndex}>
              {line.map((word, wordIndex) => {
                const nextWordTime = wordIndex + 1 < line.length ? line[wordIndex + 1].time : lineIndex + 1 < lyrics.length ? lyrics[lineIndex + 1][0].time : audioRef.current?.duration || 0;
                const durationPerChar = (nextWordTime - word.time) / word.text.length;
                return (
                  [...word.text].map((char, charIndex) => {
                    const charStartTime = word.time + (durationPerChar * charIndex);
                    const isHighlighted = currentTime <= charStartTime && currentTime < (charStartTime + durationPerChar);
                    console.log();
                    return (
                      <span
                        key={`${wordIndex}-${charIndex}`}
                        style={{
                          color: isHighlighted ? 'black' : 'white',
                          transition: 'color 1s linear'
                        }}
                      >
                        {char}
                      </span>
                    );
                  })
                );
              })}
            </p>
          ))}
        </div>
      </div>
      <div id="player">
        <div id="bar">
          <div id="currentTime"></div>
          <div id="progress-bar">
            <div id="progress"></div>
          </div>
          <div id="totalTime"></div>
        </div>
        <div id="menu">
          <audio id="audioFile"
            ref={audioRef}
            src={audioUrl}
            controls
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          >
          </audio>
        </div>
      </div>
      <div id="playlist">
        <div id="label">
          <h1>Playlist</h1>
          <input id="search" type="text" placeholder="&#xF002; Search from all songs"></input>
        </div>
        <div id="show-box">
          <div id="show-list">
          </div>
        </div>
      </div>

    </body>



  );
}

export default Lyrics;
